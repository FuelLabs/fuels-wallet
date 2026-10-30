import { Box, Button, Card, Flex, HelperIcon, Text } from '@fuel-ui/react';
import type { HashableMessage } from 'fuels';
import { AccountInfo } from '~/systems/Account';
import { ConnectInfo, Layout, coreStyles } from '~/systems/Core';
import {
  HIDDEN_CHARACTER_MARKER,
  formatMessage,
} from '~/systems/Core/utils/message';

import { useSignatureRequest } from '../../hooks';

export function SignatureRequest() {
  const { handlers, account, origin, message, isLoading, title, favIconUrl } =
    useSignatureRequest();

  if (!origin || !message || !account) return null;

  const { formattedMessage, isValid } = formatMessage(
    message as HashableMessage
  );

  return (
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
                    {formattedMessage
                      .split(HIDDEN_CHARACTER_MARKER)
                      .map((part, i) =>
                        i % 2 ? (
                          // biome-ignore lint/suspicious/noArrayIndexKey: parts never reorder
                          <Box as="span" key={i} css={styles.hiddenCharacter}>
                            {part.slice(1, -1)}
                          </Box>
                        ) : (
                          part
                        )
                      )}
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
  );
}

const styles = {
  content: {
    paddingTop: '$4 !important',
  },
  hiddenCharacter: {
    font: 'inherit',
    backgroundColor: '$intentsWarning3',
    color: '$intentsWarning11',
    borderRadius: '$default',
    padding: '0 2px',
    margin: '0 1px',
  },
};
