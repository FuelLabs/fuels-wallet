import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cx, cssObj } from '@fuel-ui/css';
import type { StackProps } from '@fuel-ui/react';
import { Stack, Heading } from '@fuel-ui/react';
import type { ReactNode } from 'react';

export type ContentHeaderProps = StackProps & {
  title: ReactNode;
  children: ReactNode;
  css?: ThemeUtilsCSS;
  className?: string;
};

export function ContentHeader({
  title,
  children,
  css,
  className,
  ...props
}: ContentHeaderProps) {
  return (
    <Stack
      gap="$1"
      as="header"
      css={{ ...styles.root, ...css }}
      className={cx(className, 'content_header')}
      {...props}
    >
      <Heading as="h3">{title}</Heading>
      {children}
    </Stack>
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
