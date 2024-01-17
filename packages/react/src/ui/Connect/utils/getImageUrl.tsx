import type { ConnectorMetadata } from '@fuel-wallet/sdk';

export const getImageUrl = (connector: ConnectorMetadata, theme?: string) => {
  const { image } = connector;
  if (typeof image === 'object') {
    return theme === 'dark' ? image.dark : image.light;
  }
  return image;
};
