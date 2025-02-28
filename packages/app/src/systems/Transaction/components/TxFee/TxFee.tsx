import { Box, HStack, Text } from '@fuel-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { type BN, DEFAULT_PRECISION } from 'fuels';
import { type FC, useEffect, useMemo, useState } from 'react';

import type { AssetFuelData } from '@fuel-wallet/types';
import { AssetsCache } from '~/systems/Asset/cache/AssetsCache';
import { convertToUsd } from '~/systems/Core/utils/convertToUsd';
import { useProvider } from '~/systems/Network/hooks/useProvider';
import { TxFeeAmountLoader } from '~/systems/Transaction/components/TxFee/TxFeeAmountLoader';
import { TxFeeLoader } from './TxFeeLoader';
import { styles } from './styles';

export type TxFeeProps = {
  fee?: BN;
  checked?: boolean;
  onChecked?: (checked: boolean) => void;
  title?: string;
};

type TxFeeComponent = FC<TxFeeProps> & {
  Loader: typeof TxFeeLoader;
};

const MotionText = motion(Text);

const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.2 } },
};

export const TxFee: TxFeeComponent = ({
  fee,
  checked,
  onChecked,
  title,
}: TxFeeProps) => {
  const provider = useProvider();
  const [baseAsset, setBaseAsset] = useState<AssetFuelData | undefined>();
  useEffect(() => {
    let abort = false;
    const getBaseAsset = async () => {
      const [baseAssetId, chainId] = await Promise.all([
        provider?.getBaseAssetId(),
        provider?.getChainId(),
      ]);
      if (abort || baseAssetId == null || chainId == null) return;
      const baseAsset = await AssetsCache.getInstance().getAsset({
        chainId: chainId,
        assetId: baseAssetId,
        dbAssets: [],
        save: false,
      });
      if (abort) return;
      setBaseAsset(baseAsset);
    };
    getBaseAsset();
    return () => {
      abort = true;
    };
  }, [provider]);

  const feeInUsd = useMemo(() => {
    if (baseAsset?.rate == null || fee == null) return '$0';

    return convertToUsd(fee, baseAsset.decimals, baseAsset.rate).formatted;
  }, [baseAsset, fee]);

  const ready = !!fee && !!feeInUsd;

  return (
    <Box
      css={styles.detailItem(!!checked, !!onChecked, !!title)}
      onClick={() => onChecked?.(true)}
    >
      <Text
        color="intentsBase12"
        css={styles.title}
        aria-label={`fee title:${title || 'Network'}`}
      >
        {title || 'Fee (network)'}
      </Text>
      <HStack gap="$1">
        <AnimatePresence>
          {!ready ? (
            <motion.div
              key="loader"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
            >
              <TxFeeAmountLoader />
            </motion.div>
          ) : (
            <MotionText
              key="feeText"
              variants={fadeInVariant}
              initial="hidden"
              animate="visible"
              color="intentsBase12"
              css={styles.usd}
              aria-label={`tip in usd:${title || 'Network'}`}
            >
              {feeInUsd}
            </MotionText>
          )}
        </AnimatePresence>
        <MotionText
          variants={fadeInVariant}
          initial="hidden"
          animate="visible"
          color="textSubtext"
          css={styles.amount}
          aria-label={`fee value:${title || 'Network'}`}
        >
          (
          {fee
            ? `${fee.format({
                minPrecision: DEFAULT_PRECISION,
                precision: DEFAULT_PRECISION,
              })} ETH`
            : '--'}
          )
        </MotionText>
      </HStack>
    </Box>
  );
};

TxFee.Loader = TxFeeLoader;
