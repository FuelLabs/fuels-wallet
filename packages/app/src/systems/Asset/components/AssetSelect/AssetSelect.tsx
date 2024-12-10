import { cssObj, cx } from '@fuel-ui/css';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Dropdown,
  Icon,
  IconButton,
  Text,
} from '@fuel-ui/react';
import type { AssetFuelAmount } from '@fuel-wallet/types';
import { memo, useState } from 'react';
import type { Maybe } from '~/systems/Core';
import { coreStyles, shortAddress } from '~/systems/Core';

export type AssetSelectInput = Partial<AssetFuelAmount>;

export type AssetSelectProps = {
  items?: Maybe<AssetSelectInput[]>;
  selected?: Maybe<string>;
  onSelect: (asset?: string | null) => void;
};

function AssetSelectBase({ items, selected, onSelect }: AssetSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const assetAmount = items?.find((i) => i.assetId === selected);

  function handleClear() {
    onSelect(null);
  }

  return (
    <Dropdown
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      popoverProps={{ align: 'start' }}
      css={styles.dropdownRoot}
    >
      <Dropdown.Trigger asChild>
        <Button
          role={assetAmount ? 'button' : 'combobox'}
          as={assetAmount ? 'div' : 'button'}
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
            {assetAmount &&
              (assetAmount.name ? (
                <>
                  <Avatar
                    name={assetAmount?.name}
                    src={assetAmount?.icon}
                    css={{ height: 18, width: 18 }}
                  />
                  <Text as="span" className="asset-name">
                    {assetAmount?.name}
                  </Text>
                </>
              ) : (
                <>
                  <Avatar.Generated
                    hash={assetAmount.assetId || ''}
                    css={{ height: 14, width: 14 }}
                    size="xsm"
                  />
                  <Text as="span" className="asset-name">
                    {shortAddress(assetAmount?.assetId)}
                  </Text>
                </>
              ))}
            {!assetAmount && (
              <Text as="span" css={styles.placeholder}>
                Select one asset
              </Text>
            )}
          </Box.Flex>
          {assetAmount && (
            <IconButton
              variant="link"
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
        css={styles.menu}
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        onAction={(assetId: any) => onSelect(assetId.toString())}
      >
        {(items || []).map((item) => {
          const assetId = item.assetId?.toString();
          const itemAsset = items?.find((a) => a.assetId === assetId);
          const { name, symbol, icon, isNft } = itemAsset || {};

          return (
            <Dropdown.MenuItem
              key={item.assetId?.toString()}
              textValue={item.assetId?.toString()}
            >
              {icon ? (
                <Avatar size="xsm" name={name || ''} src={icon} />
              ) : (
                <Avatar.Generated size="sm" hash={assetId || ''} />
              )}
              <Box className="asset-info">
                <Text as="span" className="asset-name">
                  {name || 'Unknown'}
                  {isNft && (
                    <Badge
                      variant="ghost"
                      intent="primary"
                      css={styles.assetNft}
                    >
                      NFT
                    </Badge>
                  )}
                </Text>
                <Text as="span" className="asset-symbol">
                  {symbol || shortAddress(assetId)}
                </Text>
              </Box>
            </Dropdown.MenuItem>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export const AssetSelect = memo(AssetSelectBase);

const styles = {
  trigger: cssObj({
    layer: 'input-base',
    boxSizing: 'border-box',
    minWidth: '100%',
    px: '$3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '$9',

    span: {
      fontSize: '$sm',
    },

    '.fuel_Avatar': {
      width: 20,
      height: 20,
    },

    '&:not([aria-disabled=true])': {
      '&:hover': {
        layer: 'input-base',
        borderColor: '$inputActiveBorder',
      },
      '&:active, &[aria-pressed=true]': {
        transform: 'scale(1)',
      },
      '&:focus-visible': {
        borderColor: '$intentsBase5',
        outline: 'none',
      },
    },

    '& > .fuel_Button': {
      color: '$intentsBase9',
      padding: '$0',
    },

    '.fuel_Icon-ChevronDown': {
      transition: 'transform .3s',
      color: '$inputBaseIcon',

      '&.rotate': {
        transform: 'rotate(-180deg)',
      },
    },
  }),
  input: cssObj({
    flex: 1,
    alignItems: 'center',
    gap: '$2',

    '.asset-name': {
      fontWeight: '$normal',
    },
  }),
  placeholder: cssObj({
    color: '$intentsBase9',
  }),
  menu: cssObj({
    py: '$1',
    width: 250,
    maxHeight: 410,
    ...coreStyles.scrollable('$intentsBase8', '$intentsBase10'),
    '.fuel_Avatar': {
      width: 30,
      height: 30,
    },
    '.fuel_MenuListItem': {
      py: '$2',
      px: '$3',
      height: 'auto',
    },
    '.fuel_MenuListItem:hover [class*="asset-"]': {
      color: '$bodyInverse',
    },
    '.asset-info': {
      flex: 1,
      mr: '$3',
    },
    '.asset-name, .asset-symbol': {
      display: 'block',
      fontSize: '$sm',
      lineHeight: '$tight',
    },
    '.asset-name': {
      mb: '2px',
    },
  }),
  dropdownRoot: cssObj({
    zIndex: '1 !important',
  }),
  assetNft: cssObj({
    ml: '$2',
    fontSize: '$sm',
    lineHeight: 'normal',
  }),
};
