import { render, screen, testA11y } from '@fuel-ui/test-utils';
import { TestWrapper } from '~/systems/Core';

import type { MenuItemObj } from './Menu';
import { Menu } from './Menu';

const ITEMS: MenuItemObj[] = [
  { key: 'wallet', icon: 'Wallet', label: 'Wallet0', path: '/wallet' },
  {
    key: 'support',
    icon: 'HelpCircle',
    label: 'Support',
    submenu: [
      {
        key: 'contact',
        icon: 'Mail',
        label: 'Contact Us',
        /** This page isn't created yet */
        ahref: 'https://fuel.network',
      },
      {
        key: 'discord',
        icon: 'BrandDiscordFilled',
        label: 'Fuel Discord',
        ahref: 'https://discord.com/invite/xfpK4Pe',
      },
      {
        key: 'bugs',
        icon: 'Bug',
        label: 'Report a Bug',
        /** This page isn't created yet */
        ahref: 'https://fuel.network',
      },
    ],
  },
];

describe('Menu', () => {
  it('a11y', async () => {
    await testA11y(<Menu items={ITEMS} />, { wrapper: TestWrapper });
  });

  it.skip('should navigate to path when click', async () => {
    const { user } = render(<Menu items={ITEMS} />, { wrapper: TestWrapper });
    const menuItem = screen.getByText('Wallet0');
    expect(screen.getByTestId('location-display').innerHTML).toBe('/');
    await user.click(menuItem);
    expect(screen.getByTestId('location-display').innerHTML).toBe('/wallet');
  });

  it.skip('should be able to expand submenu on click', async () => {
    const { user } = render(<Menu items={ITEMS} />, { wrapper: TestWrapper });
    const menuItem = screen.getByText('Support');

    expect(() => screen.getByText('Report a Bug')).toThrow();
    await user.click(menuItem);
    expect(screen.getByText('Report a Bug')).toBeInTheDocument();
  });
});
