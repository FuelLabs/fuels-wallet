import { cssObj } from '@fuel-ui/css';
import {
  Avatar,
  Button,
  CardList,
  Copyable,
  Flex,
  Heading,
  Icon,
  IconButton,
  Text,
  Tooltip,
} from '@fuel-ui/react';
import type { AssetAmount } from '@fuel-wallet/types';
import { bn } from 'fuels';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { AssetRemoveDialog } from '../AssetRemoveDialog';

import { AssetItemLoader } from './AssetItemLoader';

import { AmountVisibility, Pages, shortAddress } from '~/systems/Core';
import { useBalanceVisibility } from '~/systems/Core/hooks/useVisibility';

export type AssetItemProps = {
  asset: AssetAmount;
  showActions?: boolean;
  onRemove?: (assetId: string) => void;
  onEdit?: (assetId: string) => void;
};

type AssetItemComponent = FC<AssetItemProps> & {
  Loader: typeof AssetItemLoader;
};

export const AssetItem: AssetItemComponent = ({
  asset,
  showActions,
  onRemove,
  onEdit,
}) => {
  const navigate = useNavigate();
  const { visibility } = useBalanceVisibility();

  const {
    symbol,
    name = '',
    imageUrl,
    amount,
    assetId,
    isCustom,
  } = asset || {};

  function getRightEl() {
    if (showActions) {
      return (
        <Flex css={styles.actionsWrapper}>
          {isCustom && name && (
            <>
              <IconButton
                variant="link"
                icon={<Icon icon={Icon.is('Pencil')} />}
                aria-label="Edit Asset"
                onPress={() => onEdit?.(assetId)}
              />
              {onRemove && (
                <AssetRemoveDialog
                  asset={asset}
                  onConfirm={() => onRemove(asset.assetId)}
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
        </Flex>
      );
    }

    if (amount) {
      return (
        <Tooltip content={bn(amount).format()}>
          <Text css={{ fontSize: '$sm', fontWeight: '$semibold' }}>
            <AmountVisibility value={amount} visibility={visibility} /> {symbol}
          </Text>
        </Tooltip>
      );
    }

    return null;
  }

  function goToAsset() {
    navigate(Pages.assetsEdit({ id: asset.assetId }));
  }

  return (
    <CardList.Item
      rightEl={getRightEl()}
      css={{ alignItems: 'center', py: '$2', px: '$3' }}
    >
      {imageUrl ? (
        <Avatar name={name} src={imageUrl} css={{ height: 36, width: 36 }} />
      ) : (
        <Avatar.Generated hash={assetId} css={{ height: 36, width: 36 }} />
      )}
      <Flex direction="column">
        <Heading as="h6" css={styles.assetName}>
          {name || (
            <Flex>
              Unknown
              <Button
                size="xs"
                color="green"
                variant="link"
                onPress={goToAsset}
                css={styles.addAssetBtn}
              >
                (Add)
              </Button>
            </Flex>
          )}
        </Heading>
        {symbol ? (
          <Text css={styles.assetSymbol}>{symbol}</Text>
        ) : (
          <Copyable value={assetId} css={styles.unknownAssetId}>
            {shortAddress(assetId)}
          </Copyable>
        )}
      </Flex>
    </CardList.Item>
  );
};

AssetItem.Loader = AssetItemLoader;

const styles = {
  assetName: cssObj({
    margin: 0,
    textSize: 'base',
  }),
  assetSymbol: cssObj({
    textSize: 'sm',
    fontWeight: '$semibold',
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
    fontWeight: '$semibold',
  }),
  actionsWrapper: cssObj({
    '.fuel_button': {
      px: '$1 !important',
      color: '$gray8 !important',
    },

    '.fuel_button:hover': {
      color: '$gray11 !important',
    },
  }),
};
