import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createConfig } from 'fuels';

export default createConfig({
  output: './src/contracts',
  contracts: ['./contracts/custom_asset'],
  forcBuildFlags: ['--release'],
  privateKey:
    '0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298',
  providerUrl: 'http://localhost:4000/v1/graphql',
  onDeploy: (_, contracts) => {
    const contractIdsPath = join(__dirname, './src/contract-ids.json');
    let contractIds = {};
    if (existsSync(contractIdsPath)) {
      contractIds = JSON.parse(
        readFileSync(contractIdsPath, 'utf8').toString()
      );
    }

    contractIds[process.env.CONTRACT_NAME || 'contract'] =
      contracts[0].contractId;
    writeFileSync(contractIdsPath, JSON.stringify(contractIds, null, 2));
  },
});
