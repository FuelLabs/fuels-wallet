import { openPopUp } from '../../utils';

import { CRXPages } from '~/systems/Core/types';

chrome.runtime.onMessage.addListener(async (request, sender) => {
  if (sender.origin && sender.tab?.id && sender.tab.id && request.id) {
    openPopUp(String(sender.tab.id), CRXPages.popup);
  }
});
