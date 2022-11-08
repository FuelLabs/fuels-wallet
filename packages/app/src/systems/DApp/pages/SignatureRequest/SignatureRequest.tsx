import { Button, Card, Flex, HelperIcon, Text } from '@fuel-ui/react';

import { ConnectInfo, UnlockDialog } from '../../components';
import { useSignatureRequest } from '../../hooks';

import { useAccount } from '~/systems/Account';
import { Layout } from '~/systems/Core';
import { TopBarType } from '~/systems/Core/components/Layout/TopBar';

export function SignatureRequest() {
  const { isLoading } = useAccount();
  const {
    isUnlocking,
    handlers,
    account,
    origin,
    message,
    isUnlockingLoading,
  } = useSignatureRequest();

  if (!origin || !message) return null;

  return (
    <>
      <Layout title={`Signature Request`} isLoading={isLoading}>
        <Layout.TopBar type={TopBarType.external} />
        <Layout.Content>
          {account && <ConnectInfo origin={origin} account={account} />}
          <Card css={{ mt: '$4' }}>
            <Card.Body css={{ p: '$3' }}>
              <Flex css={{ alignItems: 'center', gap: '$3' }}>
                <HelperIcon
                  color="gray12"
                  css={{ fontWeight: '$semibold' }}
                  message="Make sure you know the message been signed"
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
        onUnlock={handlers.unlock}
        isLoading={isUnlockingLoading}
        onClose={handlers.closeUnlock}
      />
    </>
  );
}
