export async function openTab(url: string) {
  chrome.tabs.create({ url });
}
