import { cssObj } from '@fuel-ui/css';
import { Tag, Tooltip, Text } from '@fuel-ui/react';

import { parseUrl } from '../../utils';

export type OriginTagProps = {
  origin: string;
};

export function OriginTag({ origin }: OriginTagProps) {
  return (
    <Tag as="div" variant="outlined" css={styles.root}>
      <Tooltip content={origin} align="start" alignOffset={-10}>
        <Text as="span">{parseUrl(origin)}</Text>
      </Tooltip>
    </Tag>
  );
}

const styles = {
  root: cssObj({
    boxSizing: 'content-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 130,
    pb: '2px',
    height: '$6',
    px: '$3',
    borderColor: '$accent11',
    borderStyle: 'dashed',
    color: '$gray11',

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
