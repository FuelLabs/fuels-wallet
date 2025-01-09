import { cssObj } from '@fuel-ui/css';
import { Accordion, Badge, Box } from '@fuel-ui/react';

export const BalanceNFTs = () => {
  return (
    <Box css={styles.root}>
      <Accordion type="multiple">
        <Accordion.Item value="item-1">
          <Accordion.Trigger>
            <Badge variant="ghost" color="gray" as="span">
              4
            </Badge>
            Collection name
          </Accordion.Trigger>
          <Accordion.Content>
            <Box css={styles.grid}>
              <img
                src="https://ipfs.io/ipfs/bafybeicwudiwhs6zanzootxak3bzhxsnoagkglikrbjwucjl5c3y4xne6y/1666.png"
                alt="NFT 1"
              />
              <img
                src="https://ipfs.io/ipfs/bafybeicwudiwhs6zanzootxak3bzhxsnoagkglikrbjwucjl5c3y4xne6y/1666.png"
                alt="NFT 2"
              />
              <img
                src="https://ipfs.io/ipfs/bafybeicwudiwhs6zanzootxak3bzhxsnoagkglikrbjwucjl5c3y4xne6y/1666.png"
                alt="NFT 3"
              />
              <img
                src="https://ipfs.io/ipfs/bafybeicwudiwhs6zanzootxak3bzhxsnoagkglikrbjwucjl5c3y4xne6y/1666.png"
                alt="NFT 4"
              />
            </Box>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </Box>
  );
};

const styles = {
  root: cssObj({
    '.fuel_Accordion-trigger': {
      fontSize: '$sm',
      fontWeight: '$semibold',
      backgroundColor: 'transparent',
      color: '$intentsBase11',
      padding: '$0',
      gap: '$1',
      flexDirection: 'row-reverse',
      justifyContent: 'flex-start',
    },
    '.fuel_Accordion-trigger:hover': {
      color: '$intentsBase12',
    },
    '.fuel_Accordion-trigger[data-state="open"]': {
      color: '$intentsBase12',
    },
    '.fuel_Accordion-trigger[data-state="closed"] .fuel_Accordion-icon': {
      transform: 'rotate(-45deg)',
    },
    '.fuel_Accordion-trigger[data-state="open"] .fuel_Accordion-icon': {
      transform: 'rotate(0deg)',
    },
    '.fuel_Accordion-item': {
      backgroundColor: 'transparent',
      borderBottom: '1px solid $cardBorder',
      borderRadius: '$none',
    },
    '.fuel_Accordion-content': {
      border: '0',
      padding: '$0 $0 $2 $0',
    },
    '.fuel_Badge': {
      display: 'inline-block',
      fontWeight: '$normal',
      fontSize: '$xs',
      padding: '$1',
      pointerEvents: 'none',
      marginLeft: 'auto',
      lineHeight: 'normal',
    },
  }),
  grid: cssObj({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',

    img: {
      width: '100%',
      aspectRatio: '1 / 1',
      borderRadius: '12px',
      objectFit: 'cover',
      backgroundColor: '$cardBg',
    },
  }),
};
