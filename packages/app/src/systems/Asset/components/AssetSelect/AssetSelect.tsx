import { cssObj, cx } from '@fuel-ui/css';
import type { DropdownProps } from '@fuel-ui/react';
import {
  Avatar,
  Box,
  Button,
  Dropdown,
  Icon,
  IconButton,
  Text,
  Tooltip,
} from '@fuel-ui/react';
import type { AssetAmount } from '@fuel-wallet/types';
import { bn } from 'fuels';
import { useState } from 'react';

import type { Maybe } from '~/systems/Core';
import { shortAddress, formatAmount } from '~/systems/Core';

export type AssetSelectInput = AssetAmount;

export type AssetSelectProps = DropdownProps & {
  items?: Maybe<AssetSelectInput[]>;
  selected?: Maybe<string>;
  onSelect: (asset?: string | null) => void;
};

export function AssetSelect({
  items,
  selected,
  onSelect,
  ...props
}: AssetSelectProps) {
  const [width, setWidth] = useState<Maybe<number>>(null);
  const [isOpen, setIsOpen] = useState(false);
  const assetAmount = items?.find((i) => i.assetId === selected);

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
          role={assetAmount ? 'button' : 'combobox'}
          as={assetAmount ? 'div' : 'button'}
          color="intentsBase"
          size="md"
          css={styles.trigger}
          id="fuel_asset-select"
          aria-label="Select Asset"
          data-value={assetAmount?.name}
          rightIcon={
            <Icon
              icon="ChevronDown"
              aria-label="Button Caret"
              className={cx({ rotate: isOpen })}
            />
          }
        >
          <Box.Flex css={styles.input}>
            {assetAmount && (
              <>
                {assetAmount.name ? (
                  <>
                    <Avatar
                      name={assetAmount?.name}
                      src={assetAmount?.imageUrl}
                      css={{ height: 18, width: 18 }}
                    />
                    <Text as="span" className="asset-name">
                      {assetAmount?.name}
                    </Text>
                  </>
                ) : (
                  <>
                    <Avatar.Generated
                      hash={assetAmount.assetId}
                      css={{ height: 18, width: 18 }}
                    />
                    <Text as="span" className="asset-name">
                      {shortAddress(assetAmount?.assetId)}
                    </Text>
                  </>
                )}
              </>
            )}
            {!assetAmount && (
              <Text as="span" css={styles.placeholder}>
                Select one asset
              </Text>
            )}
          </Box.Flex>
          {assetAmount && (
            <IconButton
              variant="link"
              color="intentsBase"
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onAction={(assetId: any) => onSelect(assetId.toString())}
      >
        {(items || []).map((item) => {
          const assetId = item.assetId.toString();
          const itemAsset = items?.find((a) => a.assetId === assetId);
          const amount = bn(item.amount);
          const { name, symbol, imageUrl } = itemAsset || {};
          const amountStr = `${formatAmount(amount)} ${symbol || ''}`;

          return (
            <Dropdown.MenuItem
              key={item.assetId.toString()}
              textValue={item.assetId.toString()}
            >
              {imageUrl ? (
                <Avatar size="xsm" name={name || ''} src={imageUrl} />
              ) : (
                <Avatar.Generated size="xsm" hash={assetId} />
              )}
              <Box.Stack gap="$0" className="asset-info">
                <Text as="span" className="asset-name">
                  {name || 'Unknown'}
                </Text>
                <Text as="span" className="asset-symbol">
                  {symbol || shortAddress(assetId)}
                </Text>
              </Box.Stack>
              <Box.Flex className="asset-amount">
                <Tooltip content={amountStr}>
                  <Box as="span" className="value">
                    {amountStr}
                  </Box>
                </Tooltip>
              </Box.Flex>
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
    background: '$intentsBase2',

    span: {
      fontSize: '$sm',
    },

    '&:not([aria-disabled=true])': {
      '&:hover': {
        background: '$intentsBase2',
        boxShadow: 'none',
        borderColor: '$intentsBase5',
      },
      '&:active, &[aria-pressed=true]': {
        transform: 'scale(1)',
      },
      '&:focus-visible': {
        borderColor: '$intentsBase5',
        outline: 'none',
      },
    },

    '& > .fuel_button': {
      color: '$intentsBase9',
      padding: '$0',
    },

    '& > .fuel_icon': {
      transition: 'all .3s',
      color: '$intentsBase7',
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
      color: '$intentsBase12',
      fontWeight: '$semibold',
    },
  }),
  placeholder: cssObj({
    color: '$intentsBase9',
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
        color: '$intentsBase11',
        fontWeight: '$semibold',
      },
      '.asset-symbol': {
        color: '$intentsBase8',
        textTransform: 'uppercase',
      },
      '.asset-amount > .value': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      '.fuel_avatar-generated': {
        flexShrink: 0,
      },
    });
  },
};
