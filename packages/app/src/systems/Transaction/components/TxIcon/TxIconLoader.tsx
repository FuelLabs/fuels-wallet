import { darkColors } from '@fuel-ui/css';
import type { IContentLoaderProps } from 'react-content-loader';
import ContentLoader from 'react-content-loader';

export const TxIconLoader = (props: IContentLoaderProps) => (
  <ContentLoader
    speed={2}
    width={64}
    height={64}
    viewBox="0 0 64 64"
    backgroundColor={darkColors.gray2}
    foregroundColor={darkColors.gray3}
    {...props}
  >
    <circle cx="24" cy="36" r="20" />
  </ContentLoader>
);
