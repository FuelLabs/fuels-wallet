import { cssObj } from '@fuel-ui/css';
import { Tag, Tooltip, Text } from '@fuel-ui/react';

import { parseUrl } from '../../utils';

export type OriginTagProps = {
  origin: string;
};

export function OriginTag({ origin }: OriginTagProps) {
  return (
    <Tag as="span" variant="outlined" css={styles.root}>
      <Tooltip content={origin} align="start" alignOffset={-10}>
        <Text as="span">{parseUrl(origin)}</Text>
      </Tooltip>
    </Tag>
  );
}

const styles = {
  root: cssObj({
    maxWidth: 130,
    boxSizing: 'border-box',
    px: '$3',
    borderColor: '$accent11',
    borderStyle: 'dashed',
    color: '$intentsBase11',

    '& span': {
      width: '100%',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      fontSize: '$xs',
      color: '$accent11',
    },
  }),
};
