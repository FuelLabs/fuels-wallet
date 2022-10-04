import { Box, Button, Dialog, Flex, Icon, Spinner, Text } from '@fuel-ui/react';
import { useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';

import { useCaptcha, useFaucetDialog } from '../hooks';

import { useAccount } from '~/systems/Account';
import { Pages } from '~/systems/Core';

export function FaucetDialog() {
  const navigate = useNavigate();
  const { handlers, isLoading } = useFaucetDialog();
  const captcha = useCaptcha();
  const { account } = useAccount();

  useEffect(() => {
    if (captcha.isLoaded) {
      // need this to make captcha iframe clickable, otherwise dialog-overlay visually has priority in DOM
      document.body.style.removeProperty('pointer-events');
    }
  }, [captcha.isLoaded]);

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => !open && navigate(Pages.wallet())}
    >
      <Dialog.Content css={{ maxWidth: 334 }}>
        <Dialog.Heading>
          <Flex css={{ alignItems: 'center' }}>
            <Icon icon="MagicWand" color="gray8" css={{ marginRight: '$3' }} />
            Faucet
          </Flex>
        </Dialog.Heading>
        <Dialog.Description as="div">
          <Text color="gray12">
            Click the button bellow to receive 0.5 Devnet ETH in your wallet
          </Text>
          {captcha.needToShow && (
            <Box css={{ marginTop: '$5' }}>
              {captcha.isLoading && (
                <Flex
                  css={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 78,
                  }}
                >
                  <Spinner css={{ marginRight: '$3' }} />
                  Loading Captcha...
                </Flex>
              )}
              <Box
                css={{
                  ...(captcha.isLoading && {
                    maxHeight: 0,
                    maxWidth: 0,
                    overflow: 'hidden',
                  }),
                }}
              >
                <ReCAPTCHA {...captcha.getProps()} />
              </Box>
              {captcha.isFailed && (
                <>
                  <Text color="red10">Sorry, something went wrong here</Text>
                  <Text color="red10">
                    Please reload this page and try again.
                  </Text>
                </>
              )}
            </Box>
          )}
        </Dialog.Description>
        <Dialog.Footer css={{ marginTop: 0 }}>
          <Button
            variant="solid"
            onPress={() =>
              handlers.startFaucet({
                address: account?.address || '',
                captcha: captcha.value,
              })
            }
            css={{ width: '100%' }}
            isLoading={isLoading}
            {...(captcha.needToShow && { isDisabled: !captcha.value })}
          >
            Give me ETH
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
