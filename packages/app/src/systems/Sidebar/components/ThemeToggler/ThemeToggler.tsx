import { cssObj } from '@fuel-ui/css';
import { Box, Icon, useFuelTheme } from '@fuel-ui/react';
import type { ElementRef } from 'react';
import { useRef } from 'react';

export function ThemeToggler() {
  const { current, setTheme } = useFuelTheme();
  const ref = useRef<ElementRef<'div'>>(null);

  const handleChange = async () => {
    const next = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
  };

  return (
    <Box
      ref={ref}
      data-theme={current}
      css={styles.root}
      onClick={handleChange}
    >
      <Icon icon="SunFilled" size={14} />
      <Icon icon="MoonStars" size={14} />
    </Box>
  );
}

const styles = {
  root: cssObj({
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    px: '$2',
    width: '24px',
    height: '24px',
    borderRadius: '$full',
    border: '1px solid $border',

    '[aria-label*="Icon"]': {
      position: 'absolute',
      transition: 'all 0.2s ease',
    },
    '[aria-label*="SunFilled"]': {
      right: 8,
      color: '$textColor',
    },
    '[aria-label*="MoonStars"]': {
      left: 8,
      color: '$intentsInfo10',
    },

    '&[data-theme="light"]': {
      '[aria-label*="MoonStars"]': {
        transform: 'translateX(100%)',
        visibility: 'hidden',
        opacity: 0,
      },
    },
    '&[data-theme="dark"]': {
      '[aria-label*="SunFilled"]': {
        transform: 'translateX(-100%)',
        visibility: 'hidden',
        opacity: 0,
      },
    },
  }),
};
