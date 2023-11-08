import type { FuelConnector } from '@fuel-wallet/sdk';

export const getImageUrl = (theme: string, connector: FuelConnector) => {
  const { image } = connector.metadata;
  if (typeof image === 'object') {
    return theme === 'dark' ? image.dark : image.light;
  }
  return image;
};
