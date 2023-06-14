import { Box, Button, Card, HelperIcon, Text } from '@fuel-ui/react';

import { useSignatureRequest } from '../../hooks';

import { AccountInfo } from '~/systems/Account';
import { Layout, ConnectInfo } from '~/systems/Core';

export function SignatureRequest() {
  const { handlers, account, origin, message, isLoading, title, favIconUrl } =
    useSignatureRequest();

  if (!origin || !message || !account) return null;

  return (
    <>
      <Layout title={`Signature Request`} isLoading={isLoading} noBorder>
        <Layout.Content css={styles.content}>
          <Box.Flex gap="$4" direction="column">
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
              <Card.Header space="compact">
                <HelperIcon
                  message="Make sure you know the message being signed"
                  iconSize={14}
                >
                  Message:
                </HelperIcon>
              </Card.Header>
              <Card.Body>
                <Text as="div">
                  {/* For preserving line breaks using pre-wrap all
                    the content inside the tag can't be formatted because of
                    this we wrap the message in a div element */}
                  <Box css={{ whiteSpace: 'pre-wrap' }}>{message}</Box>
                </Text>
              </Card.Body>
            </Card>
          </Box.Flex>
        </Layout.Content>
        <Layout.BottomBar>
          <Button aria-label="Cancel" variant="ghost" onPress={handlers.reject}>
            Cancel
          </Button>
          <Button
            intent="primary"
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

const styles = {
  content: {
    paddingTop: '$4 !important',
  },
};
