import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import type { IconButtonProps } from '@fuel-ui/react';
import { Icon, IconButton } from '@fuel-ui/react';

type ButtonCloseProps = IconButtonProps & {
  css?: ThemeUtilsCSS;
};

export function ButtonClose(props: ButtonCloseProps) {
  return (
    <IconButton
      {...props}
      icon={Icon.is('X')}
      variant="link"
      css={{ ...styles.closeBtn, ...props.css }}
    />
  );
}

const styles = {
  closeBtn: cssObj({
    padding: '$0 !important',
    position: 'initial',
    height: '$4',
    top: '$2',
    right: '$2',
  }),
};
