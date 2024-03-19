import { cssObj } from '@fuel-ui/css';
import { Text } from '@fuel-ui/react';

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function Paragraph(props: any) {
  return <Text as="p" {...props} css={styles.root} />;
}

const styles = {
  root: cssObj({
    mt: '$3',
    mb: '$5',
    textSize: 'base',
    lineHeight: '1.7',
  }),
};
