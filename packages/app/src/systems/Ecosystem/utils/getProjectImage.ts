import { IGNITION_NETWORK } from '~/networks';
import { urlJoin } from '~/systems/Core';

export const getProjectImage = (image: string) => {
  return urlJoin(
    IGNITION_NETWORK.explorerUrl,
    `/api/ecosystem/asset/${image}/image`
  );
};
