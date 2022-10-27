import { Button, Card, Flex, Icon, Text } from '@fuel-ui/react';

import { ConnectInfo, UnlockDialog } from '../../components';
import { useSignatureRequest } from '../../hooks';

import { useAccount } from '~/systems/Account';
import { Layout } from '~/systems/Core';
import { TopBarType } from '~/systems/Core/components/Layout/TopBar';

export function SignatureRequest() {
  const { isLoading } = useAccount();
  const { isUnlocking, handlers, account, isUnlockingLoading } =
    useSignatureRequest();

  return (
    <>
      <Layout title={`Signature Request`} isLoading={isLoading}>
        <Layout.TopBar type={TopBarType.external} />
        <Layout.Content>
          {account && <ConnectInfo origin={'swayswap.io'} account={account} />}
          <Card css={{ mt: '$4' }}>
            <Card.Body css={{ p: '$3' }}>
              <Flex css={{ alignItems: 'center', gap: '$3' }}>
                <Text
                  fontSize="sm"
                  color="gray12"
                  css={{ fontWeight: '$semibold' }}
                >
                  Signature Message
                </Text>
                <Icon icon="Question" color="gray8" />
              </Flex>
              <Text fontSize="sm" css={{ mt: '$3' }}>
                Click to sign in and accept My App terms of service. This
                request will not trigger a blockchain transaction or cost any
                gas fee.
              </Text>
            </Card.Body>
          </Card>
        </Layout.Content>
        <Layout.BottomBar>
          <Button aria-label="Cancel" variant="ghost" color="gray">
            Cancel
          </Button>
          <Button aria-label="Sign" onPress={handlers.sign}>
            Sign
          </Button>
        </Layout.BottomBar>
      </Layout>
      <UnlockDialog
        isOpen={isUnlocking}
        onUnlock={handlers.unlock}
        isLoading={isUnlockingLoading}
        onClose={handlers.closeUnlock}
      />
    </>
  );
}
