/* eslint-disable @typescript-eslint/no-explicit-any */

import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import fs from 'node:fs';
import { EOL } from 'os';
import path from 'path';
import * as prettier from 'prettier';
import type { Root } from 'remark-gfm';
import { visit } from 'unist-util-visit';
import type { Parent } from 'unist-util-visit';

const ROOT_DIR = path.resolve(__dirname, '../../../../../../../');

function toAST(content: string) {
  return acorn.parse(content, {
    ecmaVersion: 'latest',
    sourceType: 'module',
  });
}

function extractLines(
  content: string,
  fromLine: number | undefined,
  toLine: number | undefined
) {
  const lines = content.split(EOL);
  const start = fromLine || 1;
  let end;
  if (toLine) {
    end = toLine;
  } else if (lines[lines.length - 1] === '') {
    end = lines.length - 1;
  } else {
    end = lines.length;
  }
  return lines.slice(start - 1, end).join('\n');
}

function getLineOffsets(str: string) {
  const regex = /\r?\n/g;
  const offsets = [0];
  while (regex.exec(str)) offsets.push(regex.lastIndex);
  offsets.push(str.length);
  return offsets;
}

function extractTestCase(source: string, testCase: string) {
  const ast = toAST(source);

  let charStart = 0;
  let charEnd = 0;
  let content = '';
  const chars = source.split('');
  const linesOffset = getLineOffsets(source);

  walk.fullAncestor(ast, (node: any, _state, ancestors) => {
    if (node.name === 'test') {
      const parent = ancestors.reverse()[1] as any;
      const args = parent.arguments || [];
      const val = args[0]?.value;

      if (val && val === testCase) {
        const body = args[1]?.body;
        content = chars.slice(body.start, body.end).join('').slice(1, -1);
        content = prettier.format(content, { parser: 'babel' }).trimEnd();
        charStart = body.start;
        charEnd = body.end;
      }
    }
  });

  const lineStart = linesOffset.findIndex((i) => i >= charStart);
  const lineEnd = linesOffset.findIndex((i) => i >= charEnd);

  return {
    content,
    lineStart,
    lineEnd: lineEnd !== lineStart ? lineEnd : undefined,
  };
}

const files = new Map<string, string>();
const attrsList = new Map<string, any[]>();

function getFilesOnCache(filepath: string) {
  const oldResults = files.get(filepath);
  if (!oldResults) files.set(filepath, String(fs.readFileSync(filepath)));
  return files.get(filepath);
}

interface Options {
  filepath: string;
}

export function codeImport(options: Options = { filepath: '' }) {
  const rootDir = process.cwd();
  const { filepath } = options;
  const dirname = path.relative(rootDir, path.dirname(filepath));

  return function transformer(tree: Root) {
    const nodes: [any, number | null, Parent][] = [];

    visit(tree, 'mdxJsxFlowElement', (node: any, idx, parent) => {
      if (node.name === 'CodeImport') {
        nodes.push([node as any, idx, parent as Parent]);
      }
    });

    nodes.forEach(([node]) => {
      const attr = node.attributes;
      let content = '';

      if (!attr.length) {
        throw new Error('CodeImport need to have properties defined');
      }

      const file = attr.find((i: any) => i.name === 'file')?.value;
      const lines = attr.find((i: any) => i.name === 'lines')?.value || [];
      const testCase = attr.find((i: any) => i.name === 'testCase')?.value;
      const fileAbsPath = path.resolve(path.join(rootDir, dirname), file);
      let [lineStart, lineEnd] = lines as any[];
      const fileContent = fs.readFileSync(fileAbsPath, 'utf8');
      const cachedFile = getFilesOnCache(fileAbsPath);
      const attrId = `${fileAbsPath}${testCase || ''}${lineStart || ''}${
        lineEnd || ''
      }`;
      const oldList = attrsList.get(attrId);

      /** Return result from cache if file content is the same */
      if (fileContent === cachedFile && oldList) {
        node.attributes.push(...attrsList.get(attrId)!);
        return;
      }

      if (lineStart || lineEnd) {
        content = extractLines(fileContent, lineStart, lineEnd);
      }

      if (testCase) {
        const testResult = extractTestCase(fileContent, testCase);
        lineStart = testResult.lineStart;
        lineEnd = testResult.lineEnd;
        content = testResult.content;
      }

      const newAttrs = [
        {
          name: '__content',
          type: 'mdxJsxAttribute',
          value: content,
        },
        {
          name: '__filepath',
          type: 'mdxJsxAttribute',
          value: path.resolve(dirname, file).replace(`${ROOT_DIR}/`, ''),
        },
        {
          name: '__filename',
          type: 'mdxJsxAttribute',
          value: path.parse(file).base,
        },
        {
          name: '__language',
          type: 'mdxJsxAttribute',
          value: path.extname(fileAbsPath).replace('.', ''),
        },
        {
          name: '__lineStart',
          type: 'mdxJsxAttribute',
          value: lineStart,
        },
        lineEnd && {
          name: '__lineEnd',
          type: 'mdxJsxAttribute',
          value: lineEnd,
        },
      ];

      node.attributes.push(...newAttrs);

      /** Add results on cache */
      attrsList.set(attrId, newAttrs);
    });
  };
}
