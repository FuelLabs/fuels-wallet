import { cssObj } from '@fuel-ui/css';
import { List } from '@fuel-ui/react';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function UL({ children, ...props }: any) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const isOrdered = children.some((c: any) => c?.type === 'ol');
  return (
    <List
      type={isOrdered ? 'ordered' : 'unordered'}
      {...props}
      css={styles.root}
    >
      {children
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        .map((child: any, idx: number) => {
          if (!child?.type) return null;
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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
