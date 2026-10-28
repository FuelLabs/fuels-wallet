// End to end checks of the Firefox build: pnpm test:e2e:firefox
// Needs geckodriver on the PATH (or GECKODRIVER) and Firefox (or FIREFOX_BIN).
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { type Server, createServer } from 'node:http';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { Signer, hashMessage } from 'fuels';
import { Firefox, ariaLabel, button, sleep, text, xpath } from './webdriver.ts';

const EXTENSION = fileURLToPath(new URL('../dist-firefox', import.meta.url));
const WALLET_NAME = process.env.WALLET_NAME || 'Fuel Wallet';
const PASSWORD = 'Qwe123456$';

// Talks to the wallet's content script the way a dApp connector does
const DAPP_HTML = `<!doctype html><html><head><title>Firefox e2e dApp</title></head><body>
<script>
  let nextId = 1;
  window.results = {};
  window.events = [];
  window.send = (method, params) => {
    const id = nextId++;
    window.postMessage({
      type: 'request',
      target: 'FuelContentScript',
      connectorName: ${JSON.stringify(WALLET_NAME)},
      request: { jsonrpc: '2.0', id, method, params },
    }, location.origin);
    return id;
  };
  window.addEventListener('message', ({ data, origin }) => {
    if (origin !== location.origin || data?.target !== 'FuelConnectorScript') return;
    if (data.connectorName !== ${JSON.stringify(WALLET_NAME)}) return;
    if (data.type === 'response') window.results[data.response.id] = data.response;
    if (data.type === 'event') window.events.push(...data.events);
  });
</script></body></html>`;

let firefox: Firefox;
let server: Server;
let dappUrl: string;
let popupUrl: string;
let dappTab: string;
let address: string;

async function screenshotOnFailure(name: string, fn: () => Promise<void>) {
  try {
    await fn();
  } catch (error) {
    const out = process.env.SCREENSHOTS_DIR;
    if (out) {
      writeFileSync(
        `${out}/${name}.png`,
        await firefox.screenshot().catch(() => ''),
        'base64'
      );
    }
    throw error;
  }
}

/** Sends a request from the dApp page and returns its id without waiting */
async function send(method: string, params?: unknown) {
  await firefox.switchTo(dappTab);
  return firefox.execute<number>(
    'return window.send(arguments[0], arguments[1])',
    method,
    params
  );
}

async function result(id: number, timeout = 15000) {
  await firefox.switchTo(dappTab);
  const response = await firefox.waitFor(
    () =>
      firefox.execute<{ result?: unknown; error?: unknown }>(
        'return window.results[arguments[0]]',
        id
      ),
    timeout,
    `response ${id}`
  );
  if (response.error) {
    throw new Error(`Wallet error: ${JSON.stringify(response.error)}`);
  }
  return response.result;
}

async function request(method: string, params?: unknown) {
  return result(await send(method, params));
}

/** Sends a request that opens a wallet popup, runs `approve` in it, returns the result */
async function requestWithPopup(
  method: string,
  params: unknown,
  approve: () => Promise<void>
) {
  await firefox.switchTo(dappTab);
  const before = await firefox.handles();
  const id = await send(method, params);
  await firefox.waitNewWindow(before);
  await approve();
  return result(id, 30000);
}

before(async () => {
  server = createServer((_, res) => {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(DAPP_HTML);
  });
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const { port } = server.address() as { port: number };
  dappUrl = `http://localhost:${port}/`;
  firefox = await Firefox.launch({
    headless: process.env.HEADLESS !== 'false',
  });
  await firefox.installAddon(EXTENSION);
});

after(async () => {
  await firefox?.quit();
  server?.close();
});

test('creates a wallet from the sign-up page opened on install', async () => {
  await screenshotOnFailure('sign-up', async () => {
    await firefox.switchToUrl(/sign-up/);
    popupUrl = (await firefox.url()).replace(/index\.html.*$/, 'popup.html');

    await firefox.click(text('Create new wallet'));
    await firefox.click(ariaLabel('Agree with terms'));
    await firefox.click(button('Next: Seed Phrase'));
    await firefox.find(text('Write Down Your Seed Phrase'));
    await firefox.click(button('Copy'));
    await firefox.click(ariaLabel('Confirm Saved'));
    await firefox.click(button('Next'));
    await firefox.find(text('Confirm phrase'));
    await firefox.click(button('Paste'));
    await firefox.click(button('Next'));
    await firefox.find(text('Create password for encryption'));
    await firefox.type(ariaLabel('Your Password'), PASSWORD);
    await firefox.type(ariaLabel('Confirm Password'), PASSWORD);
    await sleep(500);
    await firefox.click(button('Next'));
    await firefox.find(text('Wallet created successfully'), 40000);
  });
});

test('opens the wallet with the first account', async () => {
  await screenshotOnFailure('popup', async () => {
    await firefox.newTab(popupUrl);
    await firefox.find(text('Account 1'), 30000);
  });
});

test('lets a dApp connect and read the account', async () => {
  await screenshotOnFailure('connect', async () => {
    dappTab = await firefox.newTab(dappUrl);
    assert.equal(await request('isConnected'), false);

    const connected = await requestWithPopup('connect', undefined, async () => {
      await firefox.click(button('Next'));
      await firefox.click(xpath('//button[normalize-space(.)="Connect"]'));
    });
    assert.equal(connected, true);
    assert.equal(await request('isConnected'), true);

    address = (await request('currentAccount')) as string;
    assert.match(address, /^0x[0-9a-f]{64}$/i);
    assert.deepEqual(await request('accounts'), [address]);

    // The wallet shows the same account
    await firefox.switchToUrl(/popup\.html/);
    const short = `${address.slice(0, 6)}...${address.slice(-4)}`;
    assert.match(await firefox.bodyText(), new RegExp(short, 'i'));
    await firefox.switchTo(dappTab);

    const events = await firefox.execute<{ event: string }[]>(
      'return window.events'
    );
    assert.ok(events.some((e) => e.event === 'connection'));
  });
});

test('signs a message the account can be recovered from', async () => {
  await screenshotOnFailure('sign-message', async () => {
    const message = 'Hello from Firefox';
    const signature = (await requestWithPopup(
      'signMessage',
      { address, message },
      async () => {
        await firefox.find(text(message), 20000);
        await firefox.click(xpath('//button[normalize-space(.)="Sign"]'));
      }
    )) as string;
    const signer = Signer.recoverAddress(hashMessage(message), signature);
    assert.equal(signer.toB256().toLowerCase(), address.toLowerCase());
  });
});

test('locks and unlocks with the password', async () => {
  await screenshotOnFailure('lock', async () => {
    await firefox.switchToUrl(/popup\.html/);
    await firefox.click(ariaLabel('Menu'));
    await firefox.click(text('Lock Wallet'));
    await firefox.find(text('Enter your password to unlock your wallet'));
    await firefox.type(ariaLabel('Your Password'), PASSWORD);
    await firefox.click(button('Unlock'));
    await firefox.find(text('Account 1'), 30000);
  });
});

test('disconnects the dApp', async () => {
  await screenshotOnFailure('disconnect', async () => {
    await firefox.switchTo(dappTab);
    assert.equal(await request('disconnect'), true);
    assert.equal(await request('isConnected'), false);
  });
});
