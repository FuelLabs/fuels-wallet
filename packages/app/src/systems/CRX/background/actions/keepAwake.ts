chrome.alarms.create('KeepAwake', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'KeepAwake') {
    // eslint-disable-next-line no-console
    console.debug('[FUEL WALLET] KeepAwake signal');
  }
});
