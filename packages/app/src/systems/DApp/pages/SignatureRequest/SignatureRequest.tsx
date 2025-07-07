import { Box, Button, Card, Flex, HelperIcon, Text } from '@fuel-ui/react';
import type { HashableMessage } from 'fuels';
import { arrayify, hexlify } from 'fuels';
import { AccountInfo } from '~/systems/Account';
import { ConnectInfo, Layout, coreStyles } from '~/systems/Core';

import { useSignatureRequest } from '../../hooks';

function formatMessage(message: HashableMessage): {
  formattedMessage: string;
  isValid: boolean;
} {
  if (!message) {
    return { formattedMessage: 'No message provided', isValid: false };
  }

  if (typeof message === 'string') {
    return { formattedMessage: message, isValid: true };
  }

  if (message.personalSign) {
    const getBytes = () => {
      if (
        typeof message.personalSign === 'object' &&
        !Array.isArray(message.personalSign)
      ) {
        return new Uint8Array(Object.values(message.personalSign));
      }
      return arrayify(message.personalSign);
    };

    const tryParseAsText = (bytes: Uint8Array) => {
      const jsonStr = new TextDecoder().decode(bytes);
      const jsonObj = JSON.parse(jsonStr);
      return JSON.stringify(jsonObj, null, 2);
    };

    try {
      const bytes = getBytes();
      const formattedMessage = tryParseAsText(bytes);
      return { formattedMessage, isValid: true };
    } catch {
      try {
        const bytes = getBytes();
        return { formattedMessage: hexlify(bytes), isValid: true };
      } catch (e) {
        console.error('Error processing message:', e);
        return { formattedMessage: 'Invalid message format', isValid: false };
      }
    }
  }

  return { formattedMessage: 'Invalid message format', isValid: false };
}

export function SignatureRequest() {
  const { handlers, account, origin, message, isLoading, title, favIconUrl } =
    useSignatureRequest();

  if (!origin || !message || !account) return null;

  const { formattedMessage, isValid } = formatMessage(
    message as HashableMessage
  );

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
                        fontFamily: 'monospace',
                        color: isValid ? 'inherit' : '$red10',
                      }}
                    >
                      {formattedMessage}
                    </Text>
                  </div>
                </Flex>
                {!isValid && (
                  <Text css={{ color: '$red10', marginTop: '$2' }}>
                    Cannot sign this message due to invalid format
                  </Text>
                )}
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
            isDisabled={!isValid}
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
