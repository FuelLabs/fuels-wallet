import { Card, HStack, Text } from '@fuel-ui/react';
import { type BN, DEFAULT_PRECISION } from 'fuels';
import { type FC, useEffect, useState } from 'react';

import { convertAsset } from '~/systems/Asset/services/convert-asset';
import { useProvider } from '~/systems/Network/hooks/useProvider';
import { TxFeeLoader } from './TxFeeLoader';
import { styles } from './styles';

export type TxFeeProps = {
  fee?: BN;
  checked?: boolean;
  onChecked?: (checked: boolean) => void;
  title?: string;
  tipInUsd?: string;
};

type TxFeeComponent = FC<TxFeeProps> & {
  Loader: typeof TxFeeLoader;
};

export const TxFee: TxFeeComponent = ({
  fee,
  checked,
  onChecked,
  title,
  tipInUsd,
}: TxFeeProps) => {
  const [feeInUsdFallback, setFeeInUsdFallback] = useState<string>('$0.00');
  const provider = useProvider();

  useEffect(() => {
    let abort = false;
    async function loadAndStoreRate() {
      const baseAssetId = await provider?.getBaseAssetId();
      if (!fee || tipInUsd || !baseAssetId) return;

      convertAsset(provider?.getChainId(), baseAssetId, fee.toString()).then(
        (res) => {
          !abort && setFeeInUsdFallback(res?.amount || '$0.00');
        }
      );
    }
    loadAndStoreRate();
    return () => {
      abort = true;
    };
  }, [fee, provider, tipInUsd]);

  const tipConverted = tipInUsd || feeInUsdFallback;

  return (
    <Card
      css={styles.detailItem(!!checked, !!onChecked)}
      onClick={() => onChecked?.(true)}
    >
      <Text
        color="intentsBase11"
        css={styles.title}
        aria-label={`fee title:${title || 'Network'}`}
      >
        {title || 'Fee (network)'}
      </Text>
      <HStack gap="$1">
        {!!tipConverted && (
          <Text
            color="textSubtext"
            css={styles.amount}
            aria-label={`tip in usd:${title || 'Network'}`}
          >
            {tipConverted.includes('$0.00') ? '<$0.00' : tipInUsd}
          </Text>
        )}
        <Text
          color="intentsBase12"
          css={styles.amount}
          aria-label={`fee value:${title || 'Network'}`}
        >
          {fee
            ? `${fee.format({
                minPrecision: DEFAULT_PRECISION,
                precision: DEFAULT_PRECISION,
              })} ETH`
            : '--'}
        </Text>
      </HStack>
    </Card>
  );
};

TxFee.Loader = TxFeeLoader;
