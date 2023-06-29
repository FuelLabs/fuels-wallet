import type { ContentLoaderProps } from '@fuel-ui/react';
import { ContentLoader } from '@fuel-ui/react';

import { BalanceWidgetWrapper } from './BalanceWidget';

export const BalanceWidgetLoader = (props: ContentLoaderProps) => (
  <BalanceWidgetWrapper
    top={
      <>
        <ContentLoader width={320} height={43} viewBox="0 0 320 43" {...props}>
          <circle cx="16" cy="22" r="16" />
          <rect x="44" y="3" width="67" height="13" rx="4" />
          <rect x="44" y="25" width="90" height="13" rx="4" />
          <rect x="224" y="6" width="94" height="32" rx="4" />
        </ContentLoader>
      </>
    }
    bottom={
      <>
        <ContentLoader width={320} height={53} viewBox="0 0 320 53" {...props}>
          <rect y="4" width="67" height="13" rx="4" />
          <rect y="27" width="181" height="24" rx="4" />
        </ContentLoader>
      </>
    }
  />
);
