import { cssObj } from '@fuel-ui/css';
import { Box, Image } from '@fuel-ui/react';
import Plyr from 'plyr-react';

interface Media {
  type: 'img' | 'mp4';
  src: string;
  alt: string;
}

interface DemoProps {
  media: Media[];
}

export function Demo({ media }: DemoProps) {
  if (media.length > 0) {
    return (
      <Box.Flex css={styles.outerContainer}>
        <Box.Flex gap={'20px'} css={styles.innerContainer}>
          {media.map((example, index) => {
            if (example.type === 'img') {
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              return <Image key={index} alt={example.alt} src={example.src} />;
            }
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <Box key={index} css={styles.player}>
                <Plyr
                  source={{
                    type: 'video',
                    title: example.alt,
                    sources: [
                      { src: example.src, type: 'video/mp4', size: 720 },
                    ],
                  }}
                />
              </Box>
            );
          })}
        </Box.Flex>
      </Box.Flex>
    );
  }
}

const styles = {
  outerContainer: cssObj({
    overflow: 'hidden',
    maxWidth: '90vw',
  }),
  innerContainer: cssObj({
    flexWrap: 'nowrap',
    overflowX: 'auto',
    height: '500px',
  }),
  player: {
    height: '500px',
    minWidth: '360px',
    fontFamily: '$sans',
    overflow: 'hidden',
    '.plyr': {
      height: '500px',
    },
    '.plyr__volume': {
      display: 'none',
    },
    '.video-react-duration, .video-react-current-time': {
      fontFamily: '$sans',
    },
  },
};
