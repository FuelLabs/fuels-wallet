import { welcomeLink } from '../../config';
import { openTab } from '../../utils';

import { IS_DEVELOPMENT } from '~/config';

if (IS_DEVELOPMENT) {
  const menuId = 'open-page';
  chrome.contextMenus.create({
    title: 'Open page',
    contexts: ['action'],
    id: menuId,
    type: 'normal',
    visible: true,
  });
  chrome.contextMenus.onClicked.addListener((data) => {
    if (data.menuItemId === menuId) {
      openTab(welcomeLink());
    }
  });
}
