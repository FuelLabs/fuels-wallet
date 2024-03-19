import {
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import JSZip from 'jszip';
import type { Plugin } from 'vite';

type ZipBuildPluginOptions = {
  inDir?: string;
  outDir?: string;
  outFileName?: string;
  excludeFiles?: RegExp;
};

function addFilesToZipArchive(
  zip: JSZip,
  inDir: string,
  excludeFiles?: RegExp
) {
  const listOfFiles = readdirSync(inDir);

  // biome-ignore lint/complexity/noForEach: <explanation>
  listOfFiles.forEach((fileName) => {
    // Filter files by excludeFiles RegExp
    if (excludeFiles?.test(fileName)) return;
    // Add file to zip archive
    const filePath = join(inDir, fileName);
    const file = statSync(filePath);
    const fileDate = new Date(file.mtime);

    if (file.isDirectory()) {
      zip.file(fileName, null, {
        dir: true,
        date: fileDate,
      });
      const dir = zip?.folder(fileName);

      addFilesToZipArchive(dir, filePath, excludeFiles);
    } else {
      zip.file(fileName, readFileSync(filePath), {
        date: fileDate,
      });
    }
  });
}

export const zipBuildPlugin = ({
  inDir,
  outDir,
  outFileName,
  excludeFiles,
}: ZipBuildPluginOptions) => {
  const zip = new JSZip();
  const plugin: Plugin = {
    name: 'zip-build-plugin',
    apply: 'build',
    closeBundle: async () => {
      addFilesToZipArchive(zip, inDir, excludeFiles);

      const file = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9,
        },
      });
      const fileName = join(outDir, outFileName);
      mkdirSync(outDir, { recursive: true });
      writeFileSync(fileName, file);
    },
  };
  return plugin;
};
