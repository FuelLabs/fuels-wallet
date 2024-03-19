import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj, cx } from '@fuel-ui/css';
import type { StackProps } from '@fuel-ui/react';
import { Box, Heading } from '@fuel-ui/react';
import type { ReactNode } from 'react';

export type ContentHeaderProps = StackProps & {
  title: ReactNode;
  css?: ThemeUtilsCSS;
  children?: ReactNode;
};

export function ContentHeader({
  title,
  children,
  css,
  className,
  ...props
}: ContentHeaderProps) {
  return (
    <Box.Stack
      gap="$1"
      as="header"
      css={{ ...styles.root, ...css }}
      className={cx(className, 'content_header')}
      {...props}
    >
      <Heading as="h3">{title}</Heading>
      {children}
    </Box.Stack>
  );
}

const styles = {
  root: cssObj({
    textAlign: 'center',

    h3: {
      textSize: '2xl',
      margin: 0,
    },
  }),
};
