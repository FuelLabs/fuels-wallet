import { cssObj } from '@fuel-ui/css';
import {
  Avatar,
  Badge,
  Box,
  Button,
  CardList,
  Copyable,
  HStack,
  Icon,
  IconButton,
  Text,
  Tooltip,
  VStack,
} from '@fuel-ui/react';
import { type FC, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pages, shortAddress } from '~/systems/Core';

import { AssetRemoveDialog } from '../AssetRemoveDialog';

import type { AssetData, AssetFuelData } from '@fuel-wallet/types';
import type { BNInput } from 'fuels';
import { useTruncation } from '~/systems/Core/hooks/useTruncation';
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

  const { assetId, name, symbol, icon, decimals, isCustom } = asset ?? {};

  const { ref, open } = useTruncation<HTMLSpanElement>();

  if (!asset) return null;

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
        <AssetItemAmount
          amount={amount}
          decimals={decimals}
          rate={inputFuelAsset?.rate}
          symbol={symbol}
        />
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
    <CardList.Item
      rightEl={getRightEl()}
      css={{
        alignItems: 'center',
        '& > .fuel_Box-flex:first-child': { minWidth: 140 },
      }}
    >
      <Box css={styles.icon}>
        {icon ? (
          <Avatar
            name={name || ''}
            src={icon}
            css={{ height: 36, width: 36 }}
          />
        ) : (
          <Avatar.Generated hash={assetId || ''} size={36} />
        )}
      </Box>

      <VStack gap="0" css={styles.assetContainer}>
        <HStack gap="0" align="center">
          <Tooltip content={name} delayDuration={0} open={open}>
            <Text
              as="span"
              ref={ref}
              color="textHeading"
              fontSize="base"
              css={styles.assetName}
            >
              {name || 'Unknown'}
            </Text>
          </Tooltip>
          {!!asset.suspicious && (
            <Tooltip content={suspiciousTooltipContent}>
              <Icon
                css={styles.assetSuspicious}
                icon={Icon.is('AlertTriangle')}
              />
            </Tooltip>
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
        </HStack>
        {symbol ? (
          <HStack align="center" gap="0">
            <Text css={styles.assetSymbol}>{symbol}</Text>
            {getLeftEl()}
          </HStack>
        ) : (
          <Copyable value={assetId || ''} css={styles.unknownAssetId}>
            {shortAddress(assetId)}
          </Copyable>
        )}
      </VStack>
    </CardList.Item>
  );
};

AssetItem.Loader = AssetItemLoader;

const styles = {
  icon: cssObj({
    height: 36,
    width: 36,
    borderRadius: '$full',
    overflow: 'hidden',
    flexShrink: 0,
  }),
  assetContainer: cssObj({
    minWidth: 0,
  }),
  assetName: cssObj({
    fontWeight: '$medium',
    fontFamily: '$heading',
    letterSpacing: '$normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
  assetIdCopy: cssObj({
    marginLeft: 2,
  }),
  assetSymbol: cssObj({
    textSize: 'sm',
    fontWeight: '$normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
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
      height: 44,
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
