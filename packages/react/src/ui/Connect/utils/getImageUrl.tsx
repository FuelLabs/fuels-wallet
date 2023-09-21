import type { Connector } from '../../../types';

export const getImageUrl = (theme: string, connector: Connector) => {
  if (typeof connector.image === 'object') {
    return theme === 'dark' ? connector.image.dark : connector.image.light;
  }
  return connector.image;
};
