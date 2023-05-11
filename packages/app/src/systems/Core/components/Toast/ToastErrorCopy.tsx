import { styled } from '@fuel-ui/css';
import { Box, Button } from '@fuel-ui/react';
import './toast.css';

const TextBox = styled(Box, {
  display: 'block',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  width: 200,
});

export const getErrorToastProps = (message: string) => () =>
  (
    <span>
      <TextBox>{message}</TextBox>
      {message.length > 100 ? (
        <Button
          color="accent"
          css={{ width: 70, marginTop: 5 }}
          onPress={() => {
            navigator.clipboard.writeText(message);
          }}
        >
          Copy
        </Button>
      ) : null}
    </span>
  );

export const getErrorIcon = () => {
  return <div className="Toast-Error-Icon" />;
};
