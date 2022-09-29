import { cssObj } from '@fuel-ui/css';
import { Grid } from '@fuel-ui/react';
import type { ReactNode } from 'react';
import { Children } from 'react';

type BottomBarProps = {
  children: ReactNode;
};

export function BottomBar({ children }: BottomBarProps) {
  return (
    <Grid gap="$4" css={styles.root(Children.count(children))}>
      {children}
    </Grid>
  );
}

const styles = {
  root: (count: number) =>
    cssObj({
      width: '100%',
      px: '$4',
      py: '$4',
      boxSizing: 'border-box',
      gridTemplateColumns: `repeat(${count}, 1fr)`,
    }),
};
