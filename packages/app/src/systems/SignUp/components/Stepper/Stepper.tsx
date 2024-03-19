import type { ThemeUtilsCSS } from '@fuel-ui/css';
import { cssObj } from '@fuel-ui/css';
import type { FlexProps } from '@fuel-ui/react';
import { Box, Button, Icon } from '@fuel-ui/react';
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

const styles = {
  root: cssObj({
    gap: '$2',
    width: '$full',
  }),
  button: cssObj({
    width: '$8',
    height: '$8',
    borderRadius: '$full',
    cursor: 'not-allowed',

    '&[data-active="true"]': {
      color: '$text',
    },
  }),
};
