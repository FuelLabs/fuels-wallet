import { Button, Card, Flex, HelperIcon, Text } from '@fuel-ui/react';

import { ConnectInfo } from '../../components';
import { useSignatureRequest } from '../../hooks';

import { useAccounts } from '~/systems/Account';
import { Layout, UnlockDialog } from '~/systems/Core';
import { TopBarType } from '~/systems/Core/components/Layout/TopBar';

export function SignatureRequest() {
  const { isLoading } = useAccounts();
  const {
    isUnlocking,
    handlers,
    account,
    origin,
    message,
    unlockError,
    isUnlockingLoading,
  } = useSignatureRequest();

  if (!origin || !message || !account) return null;

  return (
    <>
      <Layout title={`Signature Request`} isLoading={isLoading}>
        <Layout.TopBar type={TopBarType.external} />
        <Layout.Content>
          {account && (
            <ConnectInfo origin={origin} account={account} isReadOnly />
          )}
          <Card css={{ mt: '$4' }}>
            <Card.Body css={{ p: '$3' }}>
              <Flex css={{ alignItems: 'center', gap: '$3' }}>
                <HelperIcon
                  color="gray12"
                  css={{ fontWeight: '$semibold' }}
                  message="Make sure you know the message being signed"
                >
                  Message:
                </HelperIcon>
              </Flex>
              <Text fontSize="sm" css={{ mt: '$3' }}>
                {/* For preserving line breaks using pre-wrap all
                    the content inside the tag can't be formatted because of
                    this we wrap the message in a div element */}
                <div style={{ whiteSpace: 'pre-wrap' }}>{message}</div>
              </Text>
            </Card.Body>
          </Card>
        </Layout.Content>
        <Layout.BottomBar>
          <Button
            aria-label="Cancel"
            variant="ghost"
            color="gray"
            onPress={handlers.reject}
          >
            Cancel
          </Button>
          <Button aria-label="Sign" onPress={handlers.sign}>
            Sign
          </Button>
        </Layout.BottomBar>
      </Layout>
      <UnlockDialog
        isOpen={isUnlocking}
        unlockError={unlockError}
        onUnlock={handlers.unlock}
        isLoading={isUnlockingLoading}
        onClose={handlers.closeUnlock}
      />
    </>
  );
}
