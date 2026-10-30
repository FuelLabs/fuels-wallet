import {
  cssObj,
  Box,
  Button,
  Icon,
  type ThemeUtilsCSS,
  type FlexProps,
} from '@fuel-wallet/ui';
import { Fragment } from 'react';

export type StepperProps = FlexProps & {
  css?: ThemeUtilsCSS;
  steps: number;
  active?: number;
  onStepChange?: (step: number) => void;
};

export function Stepper({
  active = 1,
  steps,
  onStepChange,
  css,
  ...props
}: StepperProps) {
  return (
    <Box.Flex {...props} css={{ ...styles.root, ...css }}>
      {Array.from({ length: steps }).map((_, step) => {
        const index = step + 1;
        return (
          <Fragment key={index}>
            <Button
              size="sm"
              css={styles.button}
              onPress={() => onStepChange?.(index)}
              intent={active >= index ? 'primary' : 'base'}
              variant={active > index ? 'solid' : 'outlined'}
              isDisabled={active <= index}
              leftIcon={active > index ? <Icon icon="Check" /> : undefined}
              data-complete={active >= index}
              data-active={active === index}
            >
              {active > index ? '' : index}
            </Button>
          </Fragment>
        );
      })}
    </Box.Flex>
  );
}

/* Square steps on a hairline track: done steps fill green, the current one is outlined green. */
const styles = {
  root: cssObj({
    position: 'relative',
    gap: '$2',
    width: '$full',
  }),
  button: cssObj({
    width: '28px',
    minWidth: '28px',
    height: '28px',
    px: '0 !important',
    borderRadius: 0,
    fontFamily: '$mono',
    fontSize: '12px',
    cursor: 'not-allowed',
    transition: 'background-color 300ms, box-shadow 300ms, color 300ms',

    '&[aria-disabled="true"]': {
      background: 'transparent',
      boxShadow: 'inset 0 0 0 1px var(--fuel-line)',
      color: '$textLow',
    },
    '&[data-active="true"]': {
      boxShadow: 'inset 0 0 0 1px var(--fuel-primary)',
      color: '$textHigh',
    },
    '&[data-complete="true"]:not([data-active="true"])': {
      cursor: 'pointer',
      clipPath: 'none',
      '&::after': { display: 'none' },
    },
  }),
};
