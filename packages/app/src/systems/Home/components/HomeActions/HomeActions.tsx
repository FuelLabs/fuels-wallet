import { Button, Flex } from "@fuel-ui/react";

export type HomeActionsProps = {
  isDisabled?: boolean;
};

export const HomeActions = ({ isDisabled }: HomeActionsProps) => {
  return (
    <Flex
      css={{
        marginTop: "$8",
        marginBottom: "$6",
        flexShrink: 0,
      }}
    >
      <Button
        isDisabled={isDisabled}
        css={{
          borderRadius: 40,
          marginRight: "$1",
          flex: 1,
          py: "$5",
        }}
      >
        Send
      </Button>
      <Button
        size="sm"
        isDisabled={isDisabled}
        variant="outlined"
        color="gray"
        css={{
          borderRadius: 40,
          marginLeft: "$1",
          flex: 1,
          py: "$5",
        }}
      >
        Receive
      </Button>
    </Flex>
  );
};
