/* eslint-disable no-continue */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-restricted-syntax */
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import fs from 'node:fs';
import { EOL } from 'node:os';
import path from 'node:path';
import * as prettier from 'prettier';
import type { Root } from 'remark-gfm';
import stripIndent from 'strip-indent';
import type { Parent } from 'unist-util-visit';
import { visit } from 'unist-util-visit';
import type { VFile } from 'vfile';

interface CodeImportOptions {
  async?: boolean;
  preserveTrailingNewline?: boolean;
  removeRedundantIndentations?: boolean;
  rootDir?: string;
  allowImportingFromOutside?: boolean;
}

function extractLines(
  content: string,
  fromLine: number | undefined,
  hasDash: boolean,
  toLine: number | undefined,
  preserveTrailingNewline: boolean = false
) {
  const lines = content.split(EOL);
  const start = fromLine || 1;
  let end;
  if (!hasDash) {
    end = start;
  } else if (toLine) {
    end = toLine;
  } else if (lines[lines.length - 1] === '' && !preserveTrailingNewline) {
    end = lines.length - 1;
  } else {
    end = lines.length;
  }
  return lines.slice(start - 1, end).join('\n');
}

function extractTestCase(content: string, testCase: string) {
  const ast = acorn.parse(content, {
    ecmaVersion: 'latest',
    sourceType: 'module',
  });

  let result = '';
  const lines = content.split('');

  walk.fullAncestor(ast, (node: any, _state, ancestors) => {
    if (node.name === 'test') {
      const parent = ancestors.reverse()[1] as any;
      const args = parent.arguments || [];
      const val = args[0]?.value;

      if (val && val === testCase) {
        const body = args[1]?.body;
        result = lines.slice(body.start, body.end).join('').slice(1, -1);
        result = prettier.format(result, { parser: 'babel' }).trimEnd();
      }
    }
  });

  return result;
}

function codeImport(options: CodeImportOptions = {}) {
  const rootDir = options.rootDir || process.cwd();

  if (!path.isAbsolute(rootDir)) {
    throw new Error(`"rootDir" has to be an absolute path`);
  }

  return function transformer(tree: Root, file: VFile) {
    const codes: [any, number | null, Parent][] = [];
    const promises: Promise<void>[] = [];

    visit(tree, 'code', (node, index, parent) => {
      codes.push([node as any, index, parent as Parent]);
    });

    for (const [node] of codes) {
      const fileMeta = node.meta;

      if (!fileMeta) {
        continue;
      }

      if (!file?.cwd) {
        throw new Error('"file" should be an instance of VFile');
      }

      const regexp =
        /(file=("(?<path>.+)")(#((?<from>L\d+)-?((?<to>L\d+))))?)?(\s)(testCase=("(?<case>.+)"))?/;
      const res = regexp.exec(fileMeta);
      if (!res || !res.groups || !res.groups.path) {
        throw new Error(`Unable to parse file path ${fileMeta}`);
      }

      const filePath = res.groups.path.replaceAll('"', '');
      const fromLine = res.groups.from
        ? parseInt(res.groups.from, 10)
        : undefined;

      const hasDash = !!res.groups.dash || fromLine === undefined;
      const toLine = res.groups.to ? parseInt(res.groups.to, 10) : undefined;
      const normalizedFilePath = filePath
        .replace(/^<rootDir>/, rootDir)
        .replace(/\\ /g, ' ');

      const fileAbsPath = path.resolve(file.cwd, normalizedFilePath);
      const testCase = res.groups.case;

      if (!options.allowImportingFromOutside) {
        const relFromDir = path.relative(rootDir, fileAbsPath);
        if (
          !rootDir ||
          relFromDir.startsWith(`..${path.sep}`) ||
          path.isAbsolute(relFromDir)
        ) {
          throw new Error(
            `Attempted to import code from "${fileAbsPath}", which is outside from the rootDir "${rootDir}"`
          );
        }
      }

      const fileContent = fs.readFileSync(fileAbsPath, 'utf8');

      if (fromLine || toLine) {
        node.value = extractLines(
          fileContent,
          fromLine,
          hasDash,
          toLine,
          options.preserveTrailingNewline
        );
      }

      if (testCase) {
        node.value = extractTestCase(fileContent, testCase);
      }

      if (options.removeRedundantIndentations) {
        node.value = stripIndent(node.value);
      }
    }

    if (promises.length) {
      return Promise.all(promises);
    }
  };
}

export { codeImport };
