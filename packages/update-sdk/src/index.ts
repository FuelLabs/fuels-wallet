import { ReleaseBot } from './ReleaseBot';

async function main() {
  const bot = new ReleaseBot('pedronauck', 'fuels-wallet');
  await bot.release();
}

main();
