/* eslint-disable no-console */
import admZip from 'adm-zip';
import { createWriteStream } from 'fs';
import https from 'https';
import { tmpdir } from 'os';
import path from 'path';

export async function downloadFuel(version: string) {
  const tempDirPath = tmpdir();
  const extensionUrl = `https://github.com/FuelLabs/fuels-wallet/releases/download/v${version}/fuel-wallet-${version}.zip`;
  const zipFile = path.join(tempDirPath, './fuel-wallet.zip');
  const zipFileStream = createWriteStream(zipFile);

  function downloadFile(url: string, attempt = 1) {
    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          if (res.statusCode === 302 || res.statusCode === 301) {
            if (attempt > 5) {
              // prevent infinite loops if there's a redirect loop
              reject(new Error('Too many redirects'));
              return;
            }

            const newUrl = res.headers.location!;
            console.log(`Redirecting to: ${newUrl}`);
            downloadFile(newUrl, attempt + 1).then(resolve, reject);
            return;
          }

          if (res.statusCode !== 200) {
            reject(new Error(`Unexpected status code: ${res.statusCode}`));
            return;
          }

          res.pipe(zipFileStream);

          zipFileStream.on('finish', () => {
            zipFileStream.close(resolve);
          });

          zipFileStream.on('error', (error) => {
            reject(error);
          });
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  await downloadFile(extensionUrl);
  console.log('Download Completed extracting zip...');
  const zip = new admZip(zipFile);
  const extPath = path.join(tempDirPath, './dist-crx');
  zip.extractAllTo(extPath, true);
  console.log('zip extracted');

  return extPath;
}
