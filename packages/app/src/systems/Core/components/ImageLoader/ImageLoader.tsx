import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj, darkColors } from '@fuel-ui/css';
import type { ImageProps } from '@fuel-ui/react';
import { Box, Image } from '@fuel-ui/react';
import { useState } from 'react';
import ContentLoader from 'react-content-loader';

export type ImageLoaderProps = Omit<ImageProps, 'width' | 'height'> & {
  width: ImageProps['width'];
  height: ImageProps['height'];
  css?: ThemeUtilsCSS;
  wrapperCSS?: ThemeUtilsCSS;
};

export function ImageLoader({ wrapperCSS, ...props }: ImageLoaderProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Box css={{ ...styles.root(props), ...wrapperCSS }}>
      <Loader
        {...props}
        css={{
          zIndex: '$1',
          position: 'absolute',
          top: 0,
          left: 0,
          ...(loaded && { visibility: 'hidden' }),
        }}
      />
      <Image
        {...props}
        onLoad={() => setLoaded(true)}
        css={{
          ...(!loaded && { visibility: 'hidden' }),
          ...props.css,
        }}
      />
    </Box>
  );
}

function Loader({ width, height, css }: ImageLoaderProps) {
  return (
    <Box css={css}>
      <ContentLoader
        className="loader"
        viewBox={`0 0 501 438`}
        width={width}
        height={height}
        backgroundColor={darkColors.gray2}
        foregroundColor={darkColors.gray3}
      >
        <path d="M0.00195312 62.5C0.00195312 45.924 6.58676 30.0269 18.3078 18.3058C30.0288 6.5848 45.9259 0 62.502 0H437.502C454.078 0 469.975 6.5848 481.696 18.3058C493.417 30.0269 500.002 45.924 500.002 62.5V375C500.002 391.576 493.417 407.473 481.696 419.194C469.975 430.915 454.078 437.5 437.502 437.5H62.502C45.9259 437.5 30.0288 430.915 18.3078 419.194C6.58676 407.473 0.00195313 391.576 0.00195312 375V62.5V62.5ZM31.252 343.75V375C31.252 383.288 34.5444 391.237 40.4049 397.097C46.2654 402.958 54.2139 406.25 62.502 406.25H437.502C445.79 406.25 453.739 402.958 459.599 397.097C465.46 391.237 468.752 383.288 468.752 375V265.625L350.721 204.781C347.79 203.313 344.472 202.804 341.236 203.326C338 203.847 335.01 205.373 332.689 207.687L216.752 323.625L133.627 268.25C130.626 266.252 127.026 265.353 123.438 265.706C119.849 266.059 116.494 267.643 113.939 270.187L31.252 343.75ZM187.502 140.625C187.502 128.193 182.563 116.27 173.773 107.479C164.982 98.6886 153.059 93.75 140.627 93.75C128.195 93.75 116.272 98.6886 107.481 107.479C98.6905 116.27 93.752 128.193 93.752 140.625C93.752 153.057 98.6905 164.98 107.481 173.771C116.272 182.561 128.195 187.5 140.627 187.5C153.059 187.5 164.982 182.561 173.773 173.771C182.563 164.98 187.502 153.057 187.502 140.625Z" />
      </ContentLoader>
    </Box>
  );
}

const styles = {
  root: (props: ImageLoaderProps) =>
    cssObj({
      position: 'relative',
      width: props.width,
      height: props.height,
      overflow: 'hidden',
    }),
};
