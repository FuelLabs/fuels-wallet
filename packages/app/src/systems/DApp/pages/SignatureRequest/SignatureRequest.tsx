import { Box, Button, Card, Flex, HelperIcon, Text } from '@fuel-ui/react';
import { type HashableMessage, hexlify } from 'fuels';
import { AccountInfo } from '~/systems/Account';
import { ConnectInfo, Layout, coreStyles } from '~/systems/Core';

import { useSignatureRequest } from '../../hooks';

function formatMessage(message: HashableMessage): string {
  if (typeof message === 'string') {
    return message;
  }
  if (message.personalSign) {
    return `Personal Sign: ${hexlify(message.personalSign)}`;
  }
  return 'Invalid message format';
}

export function SignatureRequest() {
  const { handlers, account, origin, message, isLoading, title, favIconUrl } =
    useSignatureRequest();

  if (!origin || !message || !account) return null;

  const formattedMessage = formatMessage(message as HashableMessage);

  return (
    <>
      <Layout title={'Signature Request'} isLoading={isLoading} noBorder>
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
                <Flex
                  css={{
                    ...coreStyles.scrollable(),
                    overflowX: 'auto',
                  }}
                >
                  <div>
                    <Text
                      css={{
                        overflowX: 'hidden',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        textIndent: '-0.25em',
                      }}
                    >
                      {formattedMessage}
                    </Text>
                  </div>
                </Flex>
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
