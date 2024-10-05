import { Box, Button } from '@fuel-ui/react';

import type { Meta, StoryFn } from '@storybook/react';
import { TransactionStatus, bn } from 'fuels';
import { FormProvider, useForm } from 'react-hook-form';
import type { SendFormValues } from '~/systems/Send/hooks';
import { TxContent, type TxContentInfoProps } from './TxContent';

export default {
  component: TxContent.Info,
  title: 'Transaction/Components/TxContent',
  decorators: [(Story) => <Story />],
  parameters: {
    viewport: {
      defaultViewport: 'chromeExtension',
    },
  },
} as Meta;

const defaultArgs = {
  tx: {
    id: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  },
  isLoading: false,
  showDetails: true,
  txStatus: TransactionStatus.success,
  fees: {
    baseFee: bn(0.01),
    regularTip: bn(0.01),
    fastTip: bn(0.01),
  },
} as TxContentInfoProps;

const Template: StoryFn<typeof TxContent.Info> = (args) => {
  const form = useForm<SendFormValues>({
    defaultValues: {
      asset: 'BTC',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      amount: bn(0.12345678),
      fees: {
        tip: {
          amount: bn(0),
          text: '0',
        },
        gasLimit: {
          amount: bn(0),
          text: '0',
        },
      },
    },
  });
  return (
    <Box css={{ maxWidth: 300 }}>
      <FormProvider {...form}>
        <TxContent.Info {...args} />
      </FormProvider>
    </Box>
  );
};

export const Default: StoryFn = Template.bind({});
Default.args = {
  ...defaultArgs,
} as TxContentInfoProps;

export const Errors: StoryFn = Template.bind({});
Errors.args = {
  ...defaultArgs,
  tx: undefined,
  txStatus: TransactionStatus.failure,
  errors: 'No assets available',
  footer: (
    <Button
      size="sm"
      variant="ghost"
      intent="error"
      onPress={() => console.log('try again')}
    >
      Try again
    </Button>
  ),
} as TxContentInfoProps;

export const Loader = () => (
  <Box
    css={{ maxWidth: 300, display: 'flex', flexDirection: 'column', gap: '$4' }}
  >
    <TxContent.Loader />
  </Box>
);
