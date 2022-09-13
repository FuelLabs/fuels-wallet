import { Button, Dialog, Flex, Icon, Text } from "@fuel-ui/react";

import { useFaucetDialog } from "../hooks/useFaucetDialog";

export function FaucetDialog() {
  const { handlers } = useFaucetDialog();

  return (
    <Dialog open={true} css={{ maxWidth: 290 }}>
      <Dialog.Content>
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
        </Dialog.Description>
        <Dialog.Footer>
          <Dialog.Close>
            <Button color="gray" variant="ghost" onPress={handlers.close}>
              Close
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
