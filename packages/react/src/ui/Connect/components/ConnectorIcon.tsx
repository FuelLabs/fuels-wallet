import type { ConnectorMetadata } from '@fuel-wallet/sdk';

import type { SvgIconProps } from '../../types';
import { FuelWalletDevelopmentIcon } from '../icons/FuelWalletDevelopmentIcon';
import { FuelWalletIcon } from '../icons/FuelWalletIcon';
import { FueletIcon } from '../icons/FueletIcon';
import { getImageUrl } from '../utils/getImageUrl';

type ConnectorIconProps = {
  connectorName: string;
  connectorMetadata: ConnectorMetadata;
} & SvgIconProps;

export function ConnectorIcon({
  connectorName,
  connectorMetadata,
  ...props
}: ConnectorIconProps) {
  switch (connectorName) {
    case 'Fuelet Wallet':
      return <FueletIcon {...props} />;
    case 'Fuel Wallet':
      return <FuelWalletIcon {...props} />;
    case 'Fuel Wallet Development':
      return <FuelWalletDevelopmentIcon {...props} />;
    default:
      return connectorMetadata.image ? (
        <img
          height={`${props.size}px`}
          width={`${props.size}px`}
          src={getImageUrl(connectorMetadata, props.theme)}
        />
      ) : null;
  }
}
