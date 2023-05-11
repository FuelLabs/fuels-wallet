import { Button } from '@fuel-ui/react';

const MAX_MESSAGE_LENGTH = 110;

export const getErrorToastProps = (message: string) => () => {
  const clampedText =
    message.length > MAX_MESSAGE_LENGTH
      ? `${message.slice(0, MAX_MESSAGE_LENGTH)}...`
      : message;
  return (
    <p>
      <p>{clampedText}</p>
      <p>
        {message.length > MAX_MESSAGE_LENGTH ? (
          <Button
            color="accent"
            css={{ width: 70 }}
            onPress={() => {
              navigator.clipboard.writeText(message);
            }}
          >
            Copy
          </Button>
        ) : null}
      </p>
    </p>
  );
};
