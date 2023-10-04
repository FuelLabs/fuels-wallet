import { Box, Button, Dialog, Icon, Spinner, Text } from '@fuel-ui/react';
import { useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useNavigate } from 'react-router-dom';
import { useAccounts } from '~/systems/Account';
import { Pages } from '~/systems/Core';

import { useCaptcha, useFaucetDialog } from '../hooks';

export function FaucetDialog() {
  const navigate = useNavigate();
  const { handlers, isLoading } = useFaucetDialog();
  const captcha = useCaptcha();
  const { account } = useAccounts();

  useEffect(() => {
    if (captcha.isLoaded) {
      // need this to make captcha iframe clickable, otherwise dialog-overlay visually has priority in DOM
      document.body.style.removeProperty('pointer-events');
    }
  }, [captcha.isLoaded]);

  return (
    <Dialog
      isOpen
      onOpenChange={(open: boolean) => !open && navigate(Pages.wallet())}
    >
      <Dialog.Content>
        <Dialog.Heading>
          <Box.Flex css={{ alignItems: 'center' }}>
            <Icon icon="Wand" css={{ marginRight: '$3' }} />
            Faucet
          </Box.Flex>
        </Dialog.Heading>
        <Dialog.Description as="div">
          <Text color="intentsBase12">
            Click the button below to receive 0.5 Devnet ETH in your wallet
          </Text>
          {captcha.needToShow && (
            <Box css={{ marginTop: '$5' }}>
              {captcha.isLoading && (
                <Box.Flex
                  css={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 78,
                  }}
                >
                  <Spinner css={{ marginRight: '$3' }} />
                  Loading Captcha...
                </Box.Flex>
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
                  <Text color="intentsError10">
                    Sorry, something went wrong here
                  </Text>
                  <Text color="intentsError10">
                    Please reload this page and try again.
                  </Text>
                </>
              )}
            </Box>
          )}
        </Dialog.Description>
        <Dialog.Footer css={{ marginTop: 0 }}>
          <Button
            intent="primary"
            onPress={() =>
              handlers.startFaucet({
                address: account!.address || '',
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
