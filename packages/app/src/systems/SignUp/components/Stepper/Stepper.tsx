import { cssObj } from '@fuel-ui/css';
import type { FlexProps } from '@fuel-ui/react';
import { Icon, Button, Box } from '@fuel-ui/react';
import { Fragment } from 'react';

export type StepperProps = FlexProps & {
  steps: number;
  active?: number;
  onChange?: (step: number) => void;
};

export function Stepper({
  active = 1,
  steps,
  onChange,
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
              onPress={() => onChange(index)}
              intent="primary"
              variant={active >= index ? 'solid' : 'outlined'}
              isDisabled={active <= index}
            >
              {index}
            </Button>
            {index !== steps && <Icon icon="ChevronRight" />}
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

    '.fuel_Button': {
      borderRadius: '$full',
    },

    '.fuel_Icon': {
      color: '$border',
    },
  }),
};
