import {
  cssObj,
  Icon,
  IconButton,
  type ThemeUtilsCSS,
  type IconButtonProps,
} from '@fuel-wallet/ui';

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
