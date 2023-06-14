import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { Alert } from '@fuel-ui/react';
import type { AlertProps } from '@fuel-ui/react';

export function DontShareAlert(props: AlertProps & { css?: ThemeUtilsCSS }) {
  return (
    <Alert status="warning" {...props}>
      <Alert.Description>
        DON&apos;T SHARE your Recovery Phrase. {'\n'}
        This phrase provides access to all your accounts. Sharing or losing it
        may result in a permanent loss of funds.
      </Alert.Description>
    </Alert>
  );
}
