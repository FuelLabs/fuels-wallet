import { Button } from '@fuel-ui/react';
import type { Story } from '@storybook/react';
import { useEffect, useState } from 'react';

import { createMockAccount } from '../../__mocks__';
import { useAccount } from '../../hooks';

import { UnlockDialog } from './UnlockDialog';

export default {
  component: UnlockDialog,
  title: 'Account/Components/UnlockDialog',
  parameters: {
    layout: 'fullscreen',
  },
};

export const Usage: Story<never> = () => {
  const { isLocked } = useAccount();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (opened && !isLocked) {
      setOpened(false);
    }
  }, [isLocked, opened]);

  return (
    <>
      <UnlockDialog isOpen={opened} />
      <Button onPress={() => setOpened(true)} isDisabled={!isLocked}>
        Open Unlock
      </Button>
    </>
  );
};

Usage.loaders = [
  async () => {
    await createMockAccount('123123123');
    return {};
  },
];
Usage.parameters = {
  layout: 'centered',
};
