import { cssObj } from '@fuel-ui/css';
import {
  Avatar,
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
import {
  AmountVisibility,
  Pages,
  formatAmount,
  shortAddress,
} from '~/systems/Core';
import { useBalanceVisibility } from '~/systems/Core/hooks/useVisibility';

import { AssetRemoveDialog } from '../AssetRemoveDialog';

import type { AssetData, AssetFuelData } from '@fuel-wallet/types';
import { type BNInput, bn } from 'fuels';
import useFuelAsset from '../../hooks/useFuelAsset';
import { AssetItemLoader } from './AssetItemLoader';

export type AssetItemProps = {
  asset?: AssetData;
  fuelAsset?: AssetFuelData;
  amount?: BNInput;
  showActions?: boolean;
  onRemove?: (assetId: string) => void;
  onEdit?: (assetId: string) => void;
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
}) => {
  const navigate = useNavigate();
  const { visibility } = useBalanceVisibility();

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
    if (assetId) {
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
      const { original } = formatAmount(amount, decimals);

      return (
        <Tooltip
          content={original.display}
          delayDuration={0}
          open={visibility ? undefined : false}
        >
          <Text css={{ fontSize: '$sm', fontWeight: '$normal' }}>
            <AmountVisibility
              value={amount}
              units={decimals}
              visibility={visibility}
            />{' '}
            {symbol}
          </Text>
        </Tooltip>
      );
    }

    return null;
  }

  function goToAsset() {
    navigate(Pages.assetsAdd({ assetId }));
  }

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
          {name || (
            <Box.Flex>
              Unknown
              <Button
                size="xs"
                intent="primary"
                variant="link"
                onPress={goToAsset}
                css={styles.addAssetBtn}
              >
                (Add)
              </Button>
            </Box.Flex>
          )}
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
};
