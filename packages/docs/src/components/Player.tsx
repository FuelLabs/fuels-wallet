'use client';

import { cssObj } from '@fuel-ui/css';
import { Box } from '@fuel-ui/react';
import dynamic from 'next/dynamic';
import type { PlyrProps } from 'plyr-react';
import { useEffect, useState } from 'react';

// plyr touches `document` at import time, so it can't load during the static export.
const Plyr = dynamic(() => import('plyr-react'), { ssr: false });

type PlayerProps = PlyrProps & {
  src: string;
};

export default function Player({ src, ...props }: PlayerProps) {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    setShowing(true);
  }, []);

  return (
    showing && (
      <Box css={styles.root}>
        <Plyr
          {...props}
          source={
            props.source || {
              type: 'video',
              sources: [{ src, type: 'video/mp4', size: 720 }],
            }
          }
        />
      </Box>
    )
  );
}

const styles = {
  root: cssObj({
    my: '$8',
    fontFamily: '$sans',

    '.video-react-duration, .video-react-current-time': {
      fontFamily: '$sans',
    },
  }),
};
