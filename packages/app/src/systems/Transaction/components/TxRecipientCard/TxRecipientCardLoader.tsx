import { cssObj, darkColors } from '@fuel-ui/css';
import { Card } from '@fuel-ui/react';
import type { IContentLoaderProps } from 'react-content-loader';
import ContentLoader from 'react-content-loader';

export const TxRecipientCardLoader = (props: IContentLoaderProps) => (
  <Card css={styles.root}>
    <ContentLoader
      speed={2}
      width={92}
      height={105}
      viewBox="0 0 92 104"
      backgroundColor={darkColors.gray2}
      foregroundColor={darkColors.gray3}
      {...props}
    >
      <rect x="15" width="62" height="14" rx="4" />
      <rect x="20" y="26" width="52" height="52" rx="26" />
      <rect x="20" y="26" width="52" height="52" rx="26" />
      <rect y="92" width="92" height="14" rx="4" />
    </ContentLoader>
  </Card>
);

const styles = {
  root: cssObj({
    minWidth: '130px',
    minHeight: '122px',
    py: '$4',
    px: '$3',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
};
