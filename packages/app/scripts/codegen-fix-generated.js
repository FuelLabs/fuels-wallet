const fs = require('fs');
const path = require('path');

async function renameInFile(filePath) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    const lines = data.split('\n');
    const lastLine = lines[lines.length - 1];
    for (let i = 0; i < lines.length - 1; i += 1) {
      lines[i] = lines[i].replace(/ReturnType/g, 'TxReturnType');
    }
    lines[lines.length - 1] = lastLine;
    const newData = lines.join('\n');
    await fs.promises.writeFile(filePath, newData, 'utf8');
  } catch (err) {
    console.log(err);
  }
}

const filename = process.argv[2];

renameInFile(path.join(__dirname, '../', filename));
