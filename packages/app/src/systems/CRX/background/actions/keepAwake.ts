chrome.alarms.create('KeepAwake', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'KeepAwake') {
    console.debug('[FUEL WALLET] KeepAwake signal');
  }
});
