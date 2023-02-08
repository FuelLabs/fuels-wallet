/**
 * This is a workaround until we have sidebar's state as global
 */
export function closeDrawer() {
  const ev = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  const drawerBtn = document.querySelector('[aria-label="drawer_closeButton"]');
  if (drawerBtn) {
    drawerBtn.dispatchEvent(ev);
  }
}
