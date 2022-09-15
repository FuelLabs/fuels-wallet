import { Box, Button, Dialog, Flex, Icon, Spinner, Text } from "@fuel-ui/react";
import { useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";

import { useCaptcha } from "../hooks/useCaptcha";
import { useFaucetDialog } from "../hooks/useFaucetDialog";

import { useAccounts } from "~/systems/Account";

export function FaucetDialog() {
  const navigate = useNavigate();
  const { handlers } = useFaucetDialog();
  const captcha = useCaptcha();
  const { currentAccount } = useAccounts();

  useEffect(() => {
    if (captcha.isLoaded) {
      // need this to make captcha iframe clickable, otherwise dialog-overlay visually has priority in DOM
      document.body.style.removeProperty("pointer-events");
    }
  }, [captcha.isLoaded]);

  return (
    <Dialog open={true} onOpenChange={(open) => !open && navigate("/")}>
      <Dialog.Content css={{ maxWidth: 340 }}>
        <Dialog.Heading>
          <Flex css={{ alignItems: "center" }}>
            <Icon icon="MagicWand" color="gray8" css={{ marginRight: "$3" }} />
            Faucet
          </Flex>
        </Dialog.Heading>
        <Dialog.Description>
          <Text css={{ marginTop: "$2" }} color="gray12">
            Click the button bellow to receive 0.5 Devnet ETH to your wallet
          </Text>
          {captcha.needToShow && (
            <Box css={{ marginTop: "$7" }}>
              {captcha.isLoading && (
                <Flex css={{ alignItems: "center", justifyContent: "center" }}>
                  <Spinner css={{ marginRight: "$3" }} />
                  Loading Captcha...
                </Flex>
              )}
              <Box
                css={{
                  ...(captcha.isLoading && {
                    maxHeight: 0,
                    maxWidth: 0,
                    overflow: "hidden",
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
        <Dialog.Footer>
          <Button
            variant="solid"
            onPress={() =>
              handlers.startFaucet({
                address: currentAccount?.address || "",
                captcha: captcha.value,
              })
            }
            css={{ width: "100%" }}
            {...(captcha.needToShow && { isDisabled: !captcha.value })}
          >
            Give me ETH
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
