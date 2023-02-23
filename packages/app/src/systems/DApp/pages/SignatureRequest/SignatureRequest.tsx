import { Button, Card, Flex, HelperIcon, Text } from '@fuel-ui/react';

import { useSignatureRequest } from '../../hooks';

import { Layout, ConnectInfo, AccountInfo } from '~/systems/Core';
import { TopBarType } from '~/systems/Core/components/Layout/TopBar';

export function SignatureRequest() {
  const { handlers, account, origin, message, isLoading, title, favIconUrl } =
    useSignatureRequest();

  if (!origin || !message || !account) return null;

  return (
    <>
      <Layout title={`Signature Request`} isLoading={isLoading}>
        <Layout.TopBar type={TopBarType.external} />
        <Layout.Content>
          <Flex gap="$4" direction="column">
            <ConnectInfo
              headerText="Signing a message to:"
              origin={origin}
              title={title || ''}
              favIconUrl={favIconUrl}
            />
            {account && (
              <AccountInfo account={account} headerText="Signer account:" />
            )}
            <Card>
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
          </Flex>
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
          <Button
            aria-label="Sign"
            onPress={handlers.sign}
            isLoading={isLoading}
          >
            Sign
          </Button>
        </Layout.BottomBar>
      </Layout>
    </>
  );
}
