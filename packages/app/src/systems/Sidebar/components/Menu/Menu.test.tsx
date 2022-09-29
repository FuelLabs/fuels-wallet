import { render, screen, testA11y } from '@fuel-ui/test-utils';

import type { MenuItemObj } from './Menu';
import { Menu } from './Menu';

import { TestWrapper } from '~/systems/Core';

const ITEMS: MenuItemObj[] = [
  { key: 'wallet', icon: 'Wallet', label: 'Wallet0', path: '/wallet' },
  {
    key: 'support',
    icon: 'Question',
    label: 'Support',
    submenu: [
      {
        key: 'contact',
        icon: 'Envelope',
        label: 'Contact Us',
        /** This page isn't created yet */
        ahref: 'https://fuel.network',
      },
      {
        key: 'discord',
        icon: 'DiscordLogo',
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

  it('should navigate to path when click', async () => {
    const { user } = render(<Menu items={ITEMS} />, { wrapper: TestWrapper });
    const menuItem = screen.getByText('Wallet0');
    expect(screen.getByTestId('location-display').innerHTML).toBe('/');
    await user.click(menuItem);
    expect(screen.getByTestId('location-display').innerHTML).toBe('/wallet');
  });

  it('should be able to expand submenu on click', async () => {
    const { user } = render(<Menu items={ITEMS} />, { wrapper: TestWrapper });
    const menuItem = screen.getByText('Support');

    expect(() => screen.getByText('Report a Bug')).toThrow();
    await user.click(menuItem);
    expect(screen.getByText('Report a Bug')).toBeInTheDocument();
  });
});
