/**
 * This file was a direct copy from "@fuel-ui/react" package.
 * That library is legacy and not maintained anymore.
 * To avoid overhead of versions we will use the component directly inside the wallet
 **/

import { cssObj } from '@fuel-ui/css';
import type { BN } from 'fuels';
import { DEFAULT_DECIMAL_UNITS, bn, format } from 'fuels';
import { useEffect, useState } from 'react';
import type { FC } from 'react';

import {
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Image,
  Input,
  InputAmountLoader,
  type InputNumberProps,
  type InputProps,
  Text,
  Tooltip,
} from '@fuel-ui/react';
import { formatAmount } from '../../utils';
import { isAmountAllowed } from './InputAmount.utils';

export const DECIMAL_UNITS = DEFAULT_DECIMAL_UNITS;

export function formatAmountLeadingZeros(text: string): string {
  const valueWithoutLeadingZeros = text
    .replace(/^0\d/, (substring) => substring.replace(/^0+(?=[\d])/, ''))
    .replace(/^0+(\d\.)/, '$1');
  const startsWithPoint = valueWithoutLeadingZeros.startsWith('.');

  if (!startsWithPoint) {
    return valueWithoutLeadingZeros;
  }
  if (valueWithoutLeadingZeros.length < 3) {
    return `0${valueWithoutLeadingZeros}`;
  }
  return text;
}

export function createAmount(text: string, units = 0) {
  const textAmountFixed = formatAmountLeadingZeros(text);

  const isZeroUnits = !units;

  let amount: BN | undefined;
  if (isZeroUnits) {
    const textWithoutDecimals = textAmountFixed
      .replaceAll(',', '')
      .split('.')[0];
    amount = bn(textWithoutDecimals);
  } else {
    amount = bn.parseUnits(textAmountFixed.replaceAll(',', ''), units);
  }

  return {
    text: textAmountFixed,
    amount,
  };
}

export type InputAmountProps = Omit<InputProps, 'size'> & {
  name?: string;
  label?: string;
  balance?: BN;
  units?: number;
  balancePrecision?: number;
  asset?: { name?: string; icon?: string; address?: string };
  assetTooltip?: string;
  hiddenMaxButton?: boolean;
  hiddenBalance?: boolean;
  value?: BN | null;
  onChange?: (val: BN | null) => void;
  onClickMax?: () => void;
  // biome-ignore lint/suspicious/noExplicitAny: allow any
  onClickAsset?: (e: any) => void;
  /* Input props */
  inputProps?: InputNumberProps;
};

type InputAmountComponent = FC<InputAmountProps> & {
  Loader: typeof InputAmountLoader;
};

export const InputAmount: InputAmountComponent = ({
  name,
  label,
  balance: initialBalance,
  balancePrecision = 3,
  value,
  units,
  hiddenBalance,
  hiddenMaxButton,
  onChange,
  onClickMax,
  inputProps,
  asset,
  assetTooltip,
  onClickAsset,
  ...props
}) => {
  const formatOpts = { units, precision: units };
  const [assetAmount, setAssetAmount] = useState<string>(
    !value || value.eq(0)
      ? ''
      : formatAmount({ amount: value, options: formatOpts })
  );

  const balance = initialBalance ?? bn(initialBalance);
  const formattedBalance = formatAmount({
    amount: balance,
    options: {
      ...formatOpts,
      precision: balancePrecision,
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: allow any
  useEffect(() => {
    handleAmountChange(
      value ? formatAmount({ amount: value, options: formatOpts }) : ''
    );
  }, [value?.toString()]);

  const handleAmountChange = (text: string) => {
    const { text: newText, amount } = createAmount(text, formatOpts.units);
    const { amount: currentAmount } = createAmount(
      assetAmount,
      formatOpts.units
    );

    if (!currentAmount.eq(amount)) {
      onChange?.(amount);
      setAssetAmount(newText);
    }
  };

  const getAssetImage = () => {
    if (asset?.icon) {
      return (
        <Image
          css={styles.image}
          src={asset.icon}
          alt={`${asset.name} image`}
        />
      );
    }

    return (
      <Avatar.Generated
        hash={asset?.address || asset?.name || ''}
        css={styles.image}
        aria-label={`${asset?.name} generated image`}
      />
    );
  };

  return (
    <Input size="lg" css={styles.input} {...props}>
      <Text fontSize="sm" color="textSubtext">
        {label}
      </Text>
      <Flex css={styles.secondRow}>
        <Input.Number
          autoComplete="off"
          inputMode="decimal"
          name={name}
          aria-label={name}
          placeholder="0.00"
          allowedDecimalSeparators={['.', ',']}
          allowNegative={false}
          thousandSeparator={false}
          allowLeadingZeros={false}
          value={assetAmount}
          onChange={(e) => {
            handleAmountChange(e.target.value);
          }}
          decimalScale={units}
          isAllowed={isAmountAllowed}
          {...inputProps}
        />
        {initialBalance && (
          <Input.ElementRight css={styles.elementRight}>
            <Box.Flex align={'center'} gap={'$2'}>
              {!hiddenMaxButton && (
                <Button
                  aria-label="Max"
                  variant="link"
                  intent="primary"
                  onPress={onClickMax}
                  css={styles.maxButton}
                >
                  MAX
                </Button>
              )}
              {asset && (
                <Tooltip content={assetTooltip}>
                  <Button
                    size="sm"
                    aria-label="Coin Selector"
                    variant="outlined"
                    intent="base"
                    onPress={onClickAsset}
                    isDisabled={!onClickAsset}
                    css={styles.assetButton}
                    iconSize={20}
                    leftIcon={getAssetImage()}
                    data-dropdown={!!onClickAsset}
                    rightIcon={onClickAsset && <Icon icon="ChevronDown" />}
                  >
                    <Text>{asset.name}</Text>
                  </Button>
                </Tooltip>
              )}
            </Box.Flex>
          </Input.ElementRight>
        )}
      </Flex>
      <Box.Flex gap={'$2'}>
        {!hiddenBalance && (
          <Tooltip
            content={formatAmount({ amount: balance, options: formatOpts })}
            sideOffset={-5}
          >
            <Text
              fontSize="sm"
              aria-label={`Balance: ${formattedBalance}`}
              color="textSubtext"
            >
              Balance: {formattedBalance}
            </Text>
          </Tooltip>
        )}
      </Box.Flex>
    </Input>
  );
};

InputAmount.Loader = InputAmountLoader;

const styles = {
  input: cssObj({
    py: '$2',
    px: '$3',
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    gap: '$0',

    input: {
      is: ['display'],
      width: '100%',
      boxSizing: 'border-box',
      fontSize: '$md',
      fontFamily: '$mono',
    },

    'input, .fuel_input-element--right': {
      px: '$0',
    },
  }),
  heading: cssObj({
    color: '$intentsBase9',
    fontSize: '$sm',
    lineHeight: '$tight',
  }),
  secondRow: cssObj({
    alignItems: 'center',
    width: '100%',
  }),
  elementRight: cssObj({
    pr: '$0',

    '[aria-disabled="true"]': {
      opacity: 'unset',
      backgroundColor: 'unset',
      color: 'unset',
    },
  }),
  balanceActions: cssObj({
    display: 'flex',
    justifyContent: 'end',
  }),
  maxButton: cssObj({
    px: '$3',
    width: '$8',
    height: '$5',
    borderRadius: '$default',
    fontSize: '$sm',
    fontFamily: '$mono',
  }),
  assetButton: cssObj({
    padding: '$1 $2',
    height: 'auto',
    gap: '$1',

    '[data-dropdown="true"]': {
      padding: '$1 $1 $1 $2',
    },
  }),
  balanceContainer: cssObj({
    gap: '$1',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    lineHeight: '$tight',
    fontSize: '$sm',
    fontWeight: '$normal',
  }),
  balanceLabel: cssObj({
    color: '$intentsBase9',
  }),
  balanceValue: cssObj({
    fontFamily: '$mono',
    color: '$intentsBase9',
  }),
  image: cssObj({
    borderRadius: '$full',
    width: '$5',
    height: '$5',
  }),
};
