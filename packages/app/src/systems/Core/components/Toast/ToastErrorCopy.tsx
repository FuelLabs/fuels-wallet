import { Button } from '@fuel-ui/react';

export const MAX_MESSAGE_LENGTH = 110;

export const getErrorToastProps = (message: string) => () => {
  const clampedText = `${message.slice(0, MAX_MESSAGE_LENGTH)}...`;
  return (
    <p>
      <p>{clampedText}</p>
      <p>
        <Button
          color="accent"
          css={{ width: 70 }}
          onPress={() => {
            navigator.clipboard.writeText(message);
          }}
        >
          Copy
        </Button>
      </p>
    </p>
  );
};
