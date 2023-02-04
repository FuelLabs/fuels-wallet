chrome.alarms.create('KeepAwake', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'KeepAwake') {
    console.log('KeepAwake signal!');
  }
});
