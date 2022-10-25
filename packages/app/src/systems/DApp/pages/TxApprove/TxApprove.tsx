import { cssObj } from '@fuel-ui/css';
import {
  Button,
  Card,
  Heading,
  HelperIcon,
  Stack,
  Tag,
  Text,
} from '@fuel-ui/react';

import { UnlockDialog } from '../../components';

import { AddressType, useAccount } from '~/systems/Account';
import { AssetsAmount } from '~/systems/Asset';
import { MOCK_ASSETS_AMOUNTS } from '~/systems/Asset/__mocks__/assets';
import { Layout } from '~/systems/Core';
import { TopBarType } from '~/systems/Core/components/Layout/TopBar';
import {
  TxDetails,
  getCoinOutputsFromTx,
  useTransaction,
  TxFromTo,
} from '~/systems/Transaction';
import { MOCK_TX_RECIPIENT } from '~/systems/Transaction/__mocks__/tx-recipient';

export type TxApproveProps = {
  id: string;
};

const { contract: CONTRACT } = MOCK_TX_RECIPIENT;

export function TxApprove() {
  const id = 'aisdjadsijds';
  const { account, isLoading } = useAccount();
  const {
    txRequest,
    simulateResult,
    handlers,
    isSent,
    isLoading: isLoadingTx,
  } = useTransaction(id!);

  return (
    <Layout title="Approve Transaction" isLoading={isLoading}>
      <Layout.TopBar type={TopBarType.external} />
      <Layout.Content css={styles.content}>
        <UnlockDialog isFullscreen onUnlock={() => {}} isOpen={false} />
        {!isLoading && !isSent && (
          <Stack gap="$4">
            <Card>
              <Card.Body
                css={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                }}
              >
                <Tag css={styles.approveUrlTag} variant="outlined">
                  <Text as="span" fontSize="sm" color="gray12">
                    swayswap.io
                  </Text>
                </Tag>
                <Text
                  as="span"
                  fontSize="sm"
                  color="gray12"
                  css={{ fontWeight: '$semibold' }}
                >
                  wants to approve
                </Text>
              </Card.Body>
            </Card>
            {account && (
              <TxFromTo
                from={{ type: AddressType.account, address: account.address }}
                to={CONTRACT}
              />
            )}
            <AssetsAmount
              title="Assets to send"
              amounts={[...MOCK_ASSETS_AMOUNTS]}
            />

            <Stack gap="$2">
              <HelperIcon as="h2" message="Some message">
                Assets amount
              </HelperIcon>
              {txRequest?.outputs && (
                <AssetsAmount amounts={getCoinOutputsFromTx(txRequest)} />
              )}
            </Stack>
            {simulateResult && <TxDetails receipts={simulateResult.receipts} />}
          </Stack>
        )}
        {isSent && (
          <Stack>
            <Heading as="h4">Transaction sent</Heading>
            <Text>
              Transaction sent successfully, you can open your wallet and check
              its status right now!
            </Text>
          </Stack>
        )}
      </Layout.Content>
      <Layout.BottomBar>
        <Button color="gray" variant="ghost">
          Close
        </Button>
        <Button
          type="submit"
          color="accent"
          onPress={handlers.approve}
          isLoading={isLoadingTx}
          isDisabled={isSent}
        >
          Send
        </Button>
      </Layout.BottomBar>
    </Layout>
  );
}

const styles = {
  content: cssObj({
    '& h2': {
      m: '$0',
      fontSize: '$sm',
      color: '$gray12',
    },
    '& h4': {
      m: '$0',
    },
  }),
  approveUrlTag: cssObj({
    alignSelf: 'center',
    background: 'transparent',
    borderColor: '$gray8',
    borderStyle: 'dashed',
  }),
};
