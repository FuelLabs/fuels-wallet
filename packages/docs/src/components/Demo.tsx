import { cssObj } from '@fuel-ui/css';
import { Image, Flex, Box } from '@fuel-ui/react';

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
      <Flex css={styles.outerContainer}>
        <Flex gap={'20px'} css={styles.innerContainer}>
          {media.map((example, index) => {
            if (example.type === 'img') {
              return <Image key={index} alt={example.alt} src={example.src} />;
            }
            return (
              <Box key={index} css={styles.player}>
                <video
                  style={styles.player}
                  title={example.alt}
                  muted
                  loop
                  autoPlay
                  playsInline
                >
                  <source src={example.src} type="video/mp4" />
                </video>
              </Box>
            );
          })}
        </Flex>
      </Flex>
    );
  }
}

const styles = {
  outerContainer: cssObj({
    overflow: 'hidden',
    maxWidth: '94vw',
  }),
  innerContainer: cssObj({
    flexWrap: 'nowrap',
    overflowX: 'scroll',
    height: '500px',
  }),
  player: {
    height: '500px',
    minWidth: '360px',
    overflow: 'hidden',
  },
};
