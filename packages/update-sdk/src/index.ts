import { ReleaseBot } from './ReleaseBot';

async function main() {
  const bot = new ReleaseBot('fuellabs', 'fuels-wallet');
  await bot.release();
}

main();
