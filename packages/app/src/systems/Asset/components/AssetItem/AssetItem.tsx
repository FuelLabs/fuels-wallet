import { cssObj } from '@fuel-ui/css';
import {
  Avatar,
  Badge,
  Box,
  Button,
  CardList,
  Copyable,
  Heading,
  Icon,
  IconButton,
  Text,
  Tooltip,
} from '@fuel-ui/react';
import { type FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pages, shortAddress } from '~/systems/Core';

import { AssetRemoveDialog } from '../AssetRemoveDialog';

import type { AssetData, AssetFuelData } from '@fuel-wallet/types';
import type { BNInput } from 'fuels';
import useFuelAsset from '../../hooks/useFuelAsset';
import { AssetItemAmount } from './AssetItemAmount';
import { AssetItemLoader } from './AssetItemLoader';

export type AssetItemProps = {
  asset?: AssetData;
  fuelAsset?: AssetFuelData;
  amount?: BNInput;
  showActions?: boolean;
  onRemove?: (assetId: string) => void;
  onEdit?: (assetId: string) => void;
  shouldShowAddAssetBtn?: boolean;
  shouldShowCopyAssetAddress?: boolean;
};

type AssetItemComponent = FC<AssetItemProps> & {
  Loader: typeof AssetItemLoader;
};

export const AssetItem: AssetItemComponent = ({
  asset: inputAsset,
  fuelAsset: inputFuelAsset,
  amount,
  showActions,
  onRemove,
  onEdit,
  shouldShowAddAssetBtn,
  shouldShowCopyAssetAddress,
}) => {
  const navigate = useNavigate();

  const fuelAssetFromInputAsset = useFuelAsset({ asset: inputAsset });
  const asset = useMemo(() => {
    if (!inputFuelAsset && !inputAsset && !fuelAssetFromInputAsset)
      return undefined;

    return (
      inputFuelAsset ||
      fuelAssetFromInputAsset || {
        ...inputAsset,
        assetId: undefined,
        decimals: undefined,
      }
    );
  }, [inputFuelAsset, inputAsset, fuelAssetFromInputAsset]);

  if (!asset) return null;

  const { assetId, name, symbol, icon, decimals, isCustom } = asset;

  function getLeftEl() {
    if (assetId && shouldShowCopyAssetAddress) {
      return (
        <Copyable
          value={assetId}
          tooltipMessage="Copy asset address"
          css={styles.assetIdCopy}
          iconProps={{
            icon: Icon.is('Copy'),
            'aria-label': 'Copy asset address',
          }}
        />
      );
    }
  }

  function getRightEl() {
    if (showActions) {
      return (
        <Box.Flex css={styles.actionsWrapper}>
          {onRemove && isCustom && name && (
            <>
              <IconButton
                variant="link"
                icon={<Icon icon={Icon.is('Edit')} />}
                aria-label="Edit Asset"
                onPress={() => onEdit?.(name)}
              />
              {onRemove && (
                <AssetRemoveDialog
                  assetName={name}
                  onConfirm={() => onRemove(name)}
                >
                  <IconButton
                    variant="link"
                    icon={<Icon icon={Icon.is('Trash')} />}
                    aria-label="Remove"
                  />
                </AssetRemoveDialog>
              )}
            </>
          )}
        </Box.Flex>
      );
    }

    if (amount) {
      return (
        <AssetItemAmount amount={amount} decimals={decimals} symbol={symbol} />
      );
    }

    return null;
  }

  function goToAsset(asset: {
    assetId?: string;
    name?: string;
    symbol?: string;
    decimals?: number;
  }) {
    navigate(Pages.assetsAdd({ assetId }), { state: asset });
  }

  const suspiciousTooltipContent = (
    <div style={{ textAlign: 'center' }}>
      This asset is flagged as suspicious,
      <br /> it may mimicking another asset.
      <br /> Proceed with caution.
    </div>
  );

  return (
    <CardList.Item rightEl={getRightEl()} css={{ alignItems: 'center' }}>
      {icon ? (
        <Avatar
          name={name || ''}
          src={icon}
          css={{ height: 36, width: 36, borderRadius: '$full' }}
        />
      ) : (
        <Avatar.Generated
          hash={assetId || ''}
          css={{ height: 36, width: 36 }}
        />
      )}
      <Box.Flex direction="column">
        <Heading as="h6" css={styles.assetName}>
          <Box.Flex>
            {name || 'Unknown'}
            {asset.suspicious ? (
              <Tooltip content={suspiciousTooltipContent}>
                <Icon
                  css={styles.assetSuspicious}
                  icon={Icon.is('AlertTriangle')}
                />
              </Tooltip>
            ) : (
              ''
            )}
            {asset.isNft && (
              <Badge variant="ghost" intent="primary" css={styles.assetNft}>
                NFT
              </Badge>
            )}
            {shouldShowAddAssetBtn && (
              <Button
                size="xs"
                intent="primary"
                variant="link"
                onPress={() => goToAsset(asset)}
                css={styles.addAssetBtn}
              >
                (Add)
              </Button>
            )}
          </Box.Flex>
        </Heading>
        <Box.Flex direction="row">
          {symbol ? (
            <>
              <Text css={styles.assetSymbol}>{symbol}</Text>
              {getLeftEl()}
            </>
          ) : (
            <Copyable value={assetId || ''} css={styles.unknownAssetId}>
              {shortAddress(assetId)}
            </Copyable>
          )}
        </Box.Flex>
      </Box.Flex>
    </CardList.Item>
  );
};

AssetItem.Loader = AssetItemLoader;

const styles = {
  assetName: cssObj({
    margin: 0,
    textSize: 'base',
  }),
  assetIdCopy: cssObj({
    marginLeft: 2,
  }),
  assetSymbol: cssObj({
    textSize: 'sm',
    fontWeight: '$normal',
  }),
  assetSuspicious: cssObj({
    marginLeft: 5,
    marginRight: 5,
    color: 'orange',
  }),
  addAssetBtn: cssObj({
    p: '0',
    ml: '$1',

    '&:focus-visible': {
      outline: 'none !important',
    },
  }),
  unknownAssetId: cssObj({
    fontSize: '$sm',
    fontWeight: '$normal',
  }),
  actionsWrapper: cssObj({
    '.fuel_Button': {
      px: '$1 !important',
      color: '$intentsBase8 !important',
    },

    '.fuel_Button:hover': {
      color: '$intentsBase11 !important',
    },
  }),
  assetNft: cssObj({
    ml: '$2',
    fontSize: '$sm',
    lineHeight: 'normal',
  }),
};
