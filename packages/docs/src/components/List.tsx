/* eslint-disable @typescript-eslint/no-explicit-any */

import { cssObj } from '@fuel-ui/css';
import { List } from '@fuel-ui/react';

export function UL({ children, ...props }: any) {
  const isOrdered = children.some((c: any) => c?.type === 'ol');
  return (
    <List
      type={isOrdered ? 'ordered' : 'unordered'}
      {...props}
      css={styles.root}
    >
      {children
        .map((child: any, idx: number) => {
          if (!child?.type) return null;
          return <List.Item key={idx}>{child.props.children}</List.Item>;
        })
        .filter(Boolean)}
    </List>
  );
}

const styles = {
  root: cssObj({
    ml: '$4',
    listStyle: 'outside',
    li: {
      pl: '$2',
      lineHeight: '1.7',
    },
  }),
};
