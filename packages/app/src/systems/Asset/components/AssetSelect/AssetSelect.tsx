import { cssObj, cx } from '@fuel-ui/css';
import type { DropdownProps } from '@fuel-ui/react';
import {
  Avatar,
  Box,
  Button,
  Dropdown,
  Flex,
  Icon,
  IconButton,
  Stack,
  Text,
  Tooltip,
} from '@fuel-ui/react';
import type { AssetAmount, Coin } from '@fuel-wallet/types';
import { bn } from 'fuels';
import React, { useState } from 'react';

import { getAssetInfoById } from '../../utils';

import type { Maybe } from '~/systems/Core';
import { formatAmount } from '~/systems/Core';
import type { TxInputCoin, TxOutputCoin } from '~/systems/Transaction/types';

export type AssetSelectInput = AssetAmount | Coin | TxOutputCoin | TxInputCoin;

export type AssetSelectProps = DropdownProps & {
  items?: Maybe<AssetSelectInput[]>;
  onSelect: (asset?: AssetSelectInput | null) => void;
  selected?: Maybe<AssetSelectInput>;
};

export function AssetSelect({
  items,
  selected,
  onSelect,
  ...props
}: AssetSelectProps) {
  const [width, setWidth] = useState<Maybe<number>>(null);
  const [isOpen, setIsOpen] = useState(false);
  const asset = selected && getAssetInfoById(selected?.assetId, selected);

  function handleSelect(assetId: React.Key) {
    const asset = (items || [])?.find((i) => i.assetId === assetId);
    onSelect(asset!);
  }

  function handleClear() {
    onSelect(null);
  }

  function handleSetWidth(isOpen: boolean) {
    if (isOpen) {
      const item = document.querySelector('#fuel_asset-select');
      setWidth(item?.clientWidth ?? null);
    }
    setIsOpen(isOpen);
  }

  return (
    <Dropdown
      {...props}
      className="fuel_asset-select"
      onOpenChange={handleSetWidth}
    >
      <Dropdown.Trigger>
        <Button
          role={asset ? 'button' : 'combobox'}
          as={asset ? 'div' : 'button'}
          color="gray"
          size="md"
          css={styles.trigger}
          id="fuel_asset-select"
          aria-label="Select Asset"
          data-value={asset?.name}
          rightIcon={
            <Icon
              icon="CaretDown"
              aria-label="Button Caret"
              className={cx({ rotate: isOpen })}
            />
          }
        >
          <Flex css={styles.input}>
            {asset ? (
              <>
                <Avatar
                  name={asset?.name}
                  src={asset?.imageUrl}
                  css={{ height: 18, width: 18 }}
                />
                <Text as="span" className="asset-name">
                  {asset?.name}
                </Text>
              </>
            ) : (
              <Text as="span" css={styles.placeholder}>
                Select one asset
              </Text>
            )}
          </Flex>
          {asset && (
            <IconButton
              variant="link"
              color="gray"
              aria-label="Clear"
              icon={Icon.is('X')}
              onPress={handleClear}
            />
          )}
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Menu
        autoFocus
        aria-label="Actions"
        css={styles.menu(width)}
        onAction={handleSelect}
      >
        {(items || []).map((item) => {
          const asset = getAssetInfoById(item.assetId, item);
          const amount = bn(asset.amount);
          const amountStr = `${formatAmount(amount)} ${asset.symbol}`;
          return (
            <Dropdown.MenuItem
              key={asset.assetId}
              textValue={asset.name}
              aria-label={asset.name}
            >
              <Avatar size="xsm" name={asset?.name} src={asset?.imageUrl} />
              <Stack gap="$0" className="asset-info">
                <Text as="span" className="asset-name">
                  {asset?.name}
                </Text>
                <Text as="span" className="asset-symbol">
                  {asset?.symbol}
                </Text>
              </Stack>
              <Flex className="asset-amount">
                <Tooltip content={amountStr}>
                  <Box as="span" className="value">
                    {amountStr}
                  </Box>
                </Tooltip>
              </Flex>
            </Dropdown.MenuItem>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

const styles = {
  trigger: cssObj({
    boxSizing: 'border-box',
    minWidth: '100%',
    px: '$3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '$gray2',

    span: {
      fontSize: '$sm',
    },

    '&:not([aria-disabled=true])': {
      '&:hover': {
        background: '$gray2',
        boxShadow: 'none',
        borderColor: '$gray5',
      },
      '&:active, &[aria-pressed=true]': {
        transform: 'scale(1)',
      },
      '&:focus-visible': {
        borderColor: '$gray5',
        outline: 'none',
      },
    },

    '& > .fuel_button': {
      color: '$gray9',
      padding: '$0',
    },

    '& > .fuel_icon': {
      transition: 'all .3s',
      color: '$gray7',
    },
    '.fuel_icon.rotate': {
      transform: 'rotate(-180deg)',
    },
  }),
  input: cssObj({
    flex: 1,
    alignItems: 'center',
    gap: '$2',

    '.asset-name': {
      color: '$gray12',
      fontWeight: '$semibold',
    },
  }),
  placeholder: cssObj({
    color: '$gray9',
  }),
  menu(width?: Maybe<number>) {
    return cssObj({
      ...(width && { width }),
      padding: '$1',

      '.fuel_menu-list-item': {
        py: '$2',
        px: '$3',
        gap: '$3',
        height: 'auto',
      },
      '.asset-info': {
        flex: 1,
      },
      '.asset-name, .asset-symbol': {
        fontSize: '$sm',
        lineHeight: 1.2,
      },
      '.asset-name': {
        color: '$gray11',
        fontWeight: '$semibold',
      },
      '.asset-symbol': {
        color: '$gray8',
        textTransform: 'uppercase',
      },
      '.asset-amount > .value': {
        width: '100px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
    });
  },
};
