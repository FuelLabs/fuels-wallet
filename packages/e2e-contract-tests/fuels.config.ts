import { existsSync, readFileSync, writeFileSync } from 'fs';
import { createConfig } from 'fuels';
import { join } from 'path';

export default createConfig({
  output: './src/contracts',
  contracts: ['./contracts/custom_asset'],
  useBuiltinForc: true,
  useBuiltinFuelCore: false,
  privateKey:
    '0xa449b1ffee0e2205fa924c6740cc48b3b473aa28587df6dab12abc245d1f5298',
  providerUrl: 'http://localhost:4001/graphql',
  onSuccess: (event) => {
    if (event.type === 'deploy') {
      const contractIdsPath = join(__dirname, './src/contract-ids.json');
      let contractIds = {};
      if (existsSync(contractIdsPath)) {
        contractIds = JSON.parse(
          readFileSync(contractIdsPath, 'utf8').toString()
        );
      }
      contractIds[process.env.CONTRACT_NAME || 'contract'] =
        event.data[0].contractId;
      writeFileSync(contractIdsPath, JSON.stringify(contractIds, null, 2));
    }
  },
});
