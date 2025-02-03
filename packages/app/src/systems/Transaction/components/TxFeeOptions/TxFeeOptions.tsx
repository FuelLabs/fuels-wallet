import { cssObj } from '@fuel-ui/css';
import { Box, Button, Form, HStack, Input, Text, VStack } from '@fuel-ui/react';
import type { AssetFuelData } from '@fuel-wallet/types';
import { AnimatePresence } from 'framer-motion';
import { type BN, bn } from 'fuels';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useAsset } from '~/systems/Asset';
import { AssetsCache } from '~/systems/Asset/cache/AssetsCache';
import { MotionFlex, MotionStack, animations } from '~/systems/Core';
import { createAmount } from '~/systems/Core/components/InputAmount/InputAmount';
import { isAmountAllowed } from '~/systems/Core/components/InputAmount/InputAmount.utils';
import { convertToUsd } from '~/systems/Core/utils/convertToUsd';
import { useProvider } from '~/systems/Network/hooks/useProvider';
import type { SendFormValues } from '~/systems/Send/hooks';
import { TxFee } from '../TxFee';
import {
  DECIMAL_UNITS,
  formatTip,
  isGasLimitAllowed,
} from './TxFeeOptions.utils';

type TxFeeOptionsProps = {
  initialAdvanced: boolean;
  baseFee: BN;
  gasLimit: BN;
  regularTip: BN;
  fastTip: BN;
  onRecalculate?: (tip: BN) => void;
};

export const TxFeeOptions = ({
  initialAdvanced,
  baseFee,
  gasLimit: gasLimitInput,
  regularTip,
  fastTip,
  onRecalculate,
}: TxFeeOptionsProps) => {
  const provider = useProvider();

  const { control, setValue, getValues } = useFormContext<SendFormValues>();
  const [baseAsset, setBaseAsset] = useState<AssetFuelData | undefined>();
  useAsset();
  const [isAdvanced, setIsAdvanced] = useState(initialAdvanced);
  const previousGasLimit = useRef<BN>(gasLimitInput);
  const previousDefaultTip = useRef<BN>(regularTip);

  const { field: tip, fieldState: tipState } = useController({
    control,
    name: 'fees.tip',
  });

  const { field: gasLimit, fieldState: gasLimitState } = useController({
    control,
    name: 'fees.gasLimit',
  });

  const advancedFee = baseFee.add(tip.value.amount);
  const regularTipInUsd =
    baseAsset?.rate != null
      ? convertToUsd(regularTip, baseAsset?.decimals, baseAsset?.rate).formatted
      : '$0.00';
  const fastTipInUsd =
    baseAsset?.rate != null
      ? convertToUsd(fastTip, baseAsset?.decimals, baseAsset?.rate).formatted
      : '$0.00';
  const advancedFeeInUsd =
    baseAsset?.rate != null
      ? convertToUsd(advancedFee, baseAsset?.decimals, baseAsset?.rate)
          .formatted
      : '$0.00';

  const options = useMemo(() => {
    return [
      {
        name: 'Regular',
        fee: baseFee.add(regularTip),
        tip: regularTip,
        tipInUsd: regularTipInUsd,
      },
      {
        name: 'Fast',
        fee: baseFee.add(fastTip),
        tip: fastTip,
        tipInUsd: fastTipInUsd,
      },
    ];
  }, [baseFee, regularTip, fastTip, regularTipInUsd, fastTipInUsd]);

  const toggle = () => {
    setIsAdvanced((curr) => !curr);
  };

  useEffect(() => {
    let abort = false;
    async function loadBaseAssetRate() {
      if (!provider) return;
      const [baseAssetId, chainId] = await Promise.all([
        provider?.getBaseAssetId(),
        provider?.getChainId(),
      ]);
      if (abort || baseAssetId == null || chainId == null) return;
      const asset = await AssetsCache.getInstance().getAsset({
        chainId: provider.getChainId(),
        assetId: baseAssetId,
        dbAssets: [],
        save: false,
      });
      if (abort) return;

      setBaseAsset(asset);
    }
    loadBaseAssetRate();
    return () => {
      abort = true;
    };
  }, [provider]);

  /**
   * Resetting fees if hiding advanced options (or initializing them
   */
  useEffect(() => {
    if (!isAdvanced) {
      const [currentTip, currentGasLimit] = getValues([
        'fees.tip.amount',
        'fees.gasLimit.amount',
      ]);

      if (!currentGasLimit.eq(previousGasLimit.current)) {
        setValue('fees.gasLimit', {
          amount: previousGasLimit.current,
          text: previousGasLimit.current.toString(),
        });
      }

      if (!currentTip.eq(previousDefaultTip.current)) {
        setValue('fees.tip', {
          amount: previousDefaultTip.current,
          text: formatTip(previousDefaultTip.current),
        });
      }
    }
  }, [isAdvanced, setValue, getValues]);

  return (
    <Box.Stack gap="$2">
      <AnimatePresence mode="popLayout">
        {isAdvanced ? (
          <MotionStack {...animations.slideInTop()} key="advanced" gap="$3">
            <TxFee
              title="Fee + Tip"
              fee={advancedFee}
              checked
              tipInUsd={advancedFeeInUsd}
            />

            <VStack gap="$1">
              <HStack gap="$3">
                <VStack gap="$2">
                  <Text fontSize="xs">Gas limit</Text>
                  <Form.Control isInvalid={Boolean(gasLimitState.error)}>
                    <Input size="sm">
                      <Input.Number
                        value={gasLimit.value.text}
                        inputMode="numeric"
                        autoComplete="off"
                        allowNegative={false}
                        thousandSeparator={false}
                        placeholder="0"
                        css={{ width: '100%' }}
                        name={gasLimit.name}
                        decimalScale={0}
                        isAllowed={isGasLimitAllowed}
                        onChange={(e) => {
                          const val = e.target.value;

                          gasLimit.onChange({
                            amount: bn(val),
                            text: val,
                          });
                        }}
                      />
                    </Input>
                  </Form.Control>
                </VStack>
                <VStack gap="$2">
                  <Text fontSize="xs">Tip</Text>
                  <Form.Control isInvalid={Boolean(tipState.error)}>
                    <Input size="sm">
                      <Input.Number
                        value={tip.value.text}
                        inputMode="decimal"
                        autoComplete="off"
                        allowedDecimalSeparators={['.']}
                        allowNegative={false}
                        thousandSeparator={false}
                        decimalScale={DECIMAL_UNITS}
                        placeholder="0.00"
                        css={{ width: '100%' }}
                        isAllowed={isAmountAllowed}
                        onChange={(e) => {
                          const text = e.target.value;
                          const { text: newText, amount } = createAmount(
                            text,
                            DECIMAL_UNITS
                          );

                          tip.onChange({
                            amount,
                            text: newText,
                          });
                        }}
                      />
                    </Input>
                  </Form.Control>
                </VStack>
              </HStack>
              {(gasLimitState.error || tipState.error) && (
                <MotionFlex {...animations.fadeIn()} key="error" layout>
                  <Form.Control isInvalid>
                    <Form.ErrorMessage
                      aria-label="Error message"
                      css={{ padding: 0 }}
                    >
                      {gasLimitState.error?.message || tipState.error?.message}
                    </Form.ErrorMessage>
                  </Form.Control>
                </MotionFlex>
              )}
            </VStack>
          </MotionStack>
        ) : (
          <MotionStack {...animations.slideInTop()} key="regular" gap="$2">
            {options.map((option) => (
              <TxFee
                key={option.name}
                fee={option.fee}
                title={option.name}
                tipInUsd={option.tipInUsd}
                checked={option.tip.eq(tip.value.amount)}
                onChecked={() => {
                  previousDefaultTip.current = option.tip;
                  setValue('fees.tip', {
                    amount: option.tip,
                    text: formatTip(option.tip),
                  });
                  onRecalculate?.(option.tip);
                }}
              />
            ))}
          </MotionStack>
        )}
        <MotionFlex
          {...animations.fadeIn()}
          key="toggle"
          align="center"
          direction="column"
          layout
        >
          <Button
            size="xs"
            variant="link"
            onPress={toggle}
            css={cssObj({
              fontSize: '12px',
              lineHeight: '16px',
              fontWeight: '$medium',
              textDecoration: 'underline',
            })}
          >
            Use {isAdvanced ? 'regular options' : 'custom fees'}
          </Button>
        </MotionFlex>
      </AnimatePresence>
    </Box.Stack>
  );
};
