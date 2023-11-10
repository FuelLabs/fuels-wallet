import type { SvgIconProps } from '../../types';
import { FuelWalletDevelopmentIcon } from '../icons/FuelWalletDevelopmentIcon';
import { FuelWalletIcon } from '../icons/FuelWalletIcon';
import { FueletIcon } from '../icons/FueletIcon';

type ConnectorIconProps = {
  connectorName: string;
} & SvgIconProps;

export function ConnectorIcon({ connectorName, ...props }: ConnectorIconProps) {
  switch (connectorName) {
    case 'Fuelet Wallet':
      return <FueletIcon {...props} />;
    case 'Fuel Wallet':
      return <FuelWalletIcon {...props} />;
    case 'Fuel Wallet Development':
      return <FuelWalletDevelopmentIcon {...props} />;
    default:
      return null;
  }
}
