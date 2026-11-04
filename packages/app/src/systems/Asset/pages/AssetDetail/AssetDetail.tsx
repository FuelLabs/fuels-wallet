import {
  cssObj,
  Alert,
  Avatar,
  Badge,
  Box,
  Button,
  Copyable,
  Icon,
  IconButton,
  Text,
} from '@fuel-wallet/ui';
import type { AssetFuelData } from '@fuel-wallet/types';
import { bn } from 'fuels';
import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IS_CRX } from '~/config';
import { useAccounts } from '~/systems/Account';
import { AssetsCache } from '~/systems/Asset/cache/AssetsCache';
import {
  AmountVisibility,
  Layout,
  MotionStack,
  Pages,
  animations,
  shortAddress,
  urlJoin,
} from '~/systems/Core';
import { useBalanceVisibility } from '~/systems/Core/hooks/useVisibility';
import { convertToUsd } from '~/systems/Core/utils/convertToUsd';
import { openTab } from '~/systems/CRX/utils';
import { useNetworks } from '~/systems/Network';

import { AssetAvatar } from '../../components/AssetAvatar';

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Box.Flex css={styles.row}>
      <Text css={styles.rowLabel}>{label}</Text>
      <Box.Flex css={styles.rowValue}>{children}</Box.Flex>
    </Box.Flex>
  );
}

function CopyValue({ value, label }: { value: string; label: string }) {
  return (
    <Copyable value={value} tooltipMessage={`Copy ${label}`}>
      <Text css={styles.mono}>{shortAddress(value)}</Text>
    </Copyable>
  );
}

export function AssetDetail() {
  const navigate = useNavigate();
  const { assetId = '' } = useParams<{ assetId: string }>();
  const { account } = useAccounts();
  const { selectedNetwork } = useNetworks();
  const { visibility } = useBalanceVisibility();

  const balance = account?.balances?.find((b) => b.assetId === assetId);
  const [fetched, setFetched] = useState<AssetFuelData>();
  const asset = balance?.asset ?? fetched;

  /* Assets the account no longer holds are not in its balances, so look them up. */
  useEffect(() => {
    const chainId = selectedNetwork?.chainId;
    setFetched(undefined);
    if (balance?.asset || chainId == null || !assetId) return;
    let cancelled = false;
    AssetsCache.fetchAllAssets(chainId, [assetId])
      .then((assets) => {
        if (!cancelled) setFetched(assets.get(assetId) as AssetFuelData);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [assetId, balance?.asset, selectedNetwork?.chainId]);

  const amount = balance?.amount ?? bn(0);
  const decimals = asset?.decimals;
  const symbol = asset?.symbol;
  const rate = asset?.rate;

  const amountInUsd = useMemo(() => {
    if (!rate || decimals == null) return undefined;
    return convertToUsd(bn(amount), decimals, rate).formatted;
  }, [amount, decimals, rate]);

  const contractHref =
    asset?.contractId && selectedNetwork?.explorerUrl
      ? urlJoin(
          selectedNetwork.explorerUrl,
          `/contract/${asset.contractId}/minted-assets`
        )
      : undefined;

  function openContract() {
    if (!contractHref) return;
    if (IS_CRX) openTab(contractHref);
    else window.open(contractHref, '_blank', 'noopener');
  }

  const source = asset?.isCustom
    ? 'Added by you'
    : asset?.verified
      ? 'Verified'
      : asset?.name
        ? 'Listed'
        : 'Unknown';

  return (
    <Layout title={asset?.name || 'Asset'}>
      <Layout.TopBar onBack={() => navigate(Pages.wallet())} />
      <Layout.Content css={styles.content}>
        <MotionStack {...animations.slideInTop()} css={styles.stack}>
          <Box.Flex css={styles.hero}>
            {asset?.icon ? (
              <AssetAvatar name={asset.name} src={asset.icon} size={48} />
            ) : (
              <Avatar.Generated hash={assetId} size={48} />
            )}
            <Box.Stack gap="$1" css={{ minWidth: 0 }}>
              <Text as="h2" css={styles.name}>
                {asset?.name || 'Unknown asset'}
              </Text>
              <Box.Flex css={styles.badges}>
                {symbol && <Text css={styles.symbol}>{symbol}</Text>}
                {asset?.verified && (
                  <Badge variant="ghost" intent="primary">
                    Verified
                  </Badge>
                )}
                {asset?.isNft && (
                  <Badge variant="ghost" intent="primary">
                    NFT
                  </Badge>
                )}
              </Box.Flex>
            </Box.Stack>
          </Box.Flex>

          {asset?.suspicious && (
            <Alert status="warning">
              <Alert.Description as="div">
                This asset is flagged as suspicious. It may be imitating another
                asset.
              </Alert.Description>
            </Alert>
          )}

          <Box.Stack gap="$1">
            <Text css={styles.eyebrow}>Balance</Text>
            <Box.Flex css={styles.amountRow}>
              <Text
                key={String(visibility)}
                className="fuel-appear"
                css={styles.amount}
                aria-label={`${symbol ?? 'Asset'} balance`}
              >
                <AmountVisibility
                  value={amount}
                  units={decimals}
                  visibility={visibility}
                />
              </Text>
              {symbol && <Text css={styles.amountSymbol}>{symbol}</Text>}
            </Box.Flex>
            {amountInUsd && (
              <Text css={styles.usd}>{visibility ? amountInUsd : '$••••'}</Text>
            )}
          </Box.Stack>

          <Box.Flex css={styles.actions}>
            <Button
              size="sm"
              intent="primary"
              leftIcon={<Icon icon="Send" />}
              isDisabled={bn(amount).isZero()}
              onPress={() => navigate(Pages.send(), { state: { assetId } })}
            >
              Send
            </Button>
            <Button
              size="sm"
              variant="outlined"
              leftIcon={<Icon icon="Qrcode" />}
              onPress={() => navigate(Pages.receive())}
            >
              Receive
            </Button>
          </Box.Flex>

          <Box.Stack gap="0" css={styles.details} className="fuel-stagger">
            <DetailRow label="Asset ID">
              <CopyValue value={assetId} label="asset ID" />
            </DetailRow>
            {asset?.contractId && (
              <DetailRow label="Contract">
                <CopyValue value={asset.contractId} label="contract ID" />
                {contractHref && (
                  <IconButton
                    size="xs"
                    variant="link"
                    icon={<Icon icon="ExternalLink" size={16} />}
                    aria-label="View contract on explorer"
                    onPress={openContract}
                  />
                )}
              </DetailRow>
            )}
            {decimals != null && (
              <DetailRow label="Decimals">
                <Text css={styles.mono}>{decimals}</Text>
              </DetailRow>
            )}
            {!!rate && (
              <DetailRow label="Price">
                <Text css={styles.mono}>
                  {rate.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumSignificantDigits: 6,
                  })}
                </Text>
              </DetailRow>
            )}
            <DetailRow label="Source">
              <Text css={styles.mono}>{source}</Text>
            </DetailRow>
          </Box.Stack>
        </MotionStack>
      </Layout.Content>
    </Layout>
  );
}

const styles = {
  content: cssObj({
    mt: '$4',
  }),
  stack: cssObj({
    gap: '$5',
  }),
  hero: cssObj({
    alignItems: 'center',
    gap: '$3',

    '& > .fuel_Avatar, & > .fuel_Avatar-generated': { flexShrink: 0 },
  }),
  name: cssObj({
    m: 0,
    color: '$textHigh',
    fontSize: '$xl',
    fontWeight: '$medium',
    lineHeight: '28px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
  badges: cssObj({
    alignItems: 'center',
    gap: '$2',
  }),
  symbol: cssObj({
    fontFamily: '$mono',
    fontSize: '12px',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    color: '$textLow',
  }),
  eyebrow: cssObj({
    fontFamily: '$mono',
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    color: '$textLow',
  }),
  amountRow: cssObj({
    alignItems: 'baseline',
    gap: '$2',
    minWidth: 0,
  }),
  amount: cssObj({
    fontFamily: '$mono',
    fontSize: '28px',
    lineHeight: '36px',
    fontWeight: '$bold',
    color: '$textHigh',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
  amountSymbol: cssObj({
    fontFamily: '$mono',
    fontSize: '$sm',
    color: '$textLow',
  }),
  usd: cssObj({
    fontFamily: '$mono',
    fontSize: '$sm',
    color: '$textLow',
  }),
  actions: cssObj({
    gap: '$2',
    '& > button': { flex: 1 },
  }),
  details: cssObj({
    boxShadow: 'inset 0 0 0 1px var(--fuel-line)',
    background: '$cardBg',
  }),
  row: cssObj({
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '$3',
    minHeight: 44,
    px: '$3',

    '& + &': { borderTop: '1px solid var(--fuel-line)' },
  }),
  rowLabel: cssObj({
    fontFamily: '$mono',
    fontSize: '12px',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    color: '$textLow',
    flexShrink: 0,
  }),
  rowValue: cssObj({
    alignItems: 'center',
    gap: '$1',
    minWidth: 0,
  }),
  mono: cssObj({
    fontFamily: '$mono',
    fontSize: '$sm',
    color: '$textHigh',
  }),
};
