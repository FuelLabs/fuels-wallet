import './pageScript';

async function main() {
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL('src/systems/CRX/pageScript.ts.js');
  s.onload = () => {
    s.remove();
  };
  (document.head || document.documentElement).appendChild(s);
}

main();
