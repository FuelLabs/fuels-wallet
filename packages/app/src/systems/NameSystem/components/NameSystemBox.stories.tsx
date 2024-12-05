import { Box, Button } from '@fuel-ui/react';

import { useState } from 'react';
import {
  NameSystemBox,
  type NameSystemBoxProps,
  NameSystemWrapper,
} from '~/systems/NameSystem';
import { MOCK_NAMES } from '~/systems/NameSystem/__mocks__';

export default {
  component: NameSystemBox,
  title: 'NameSystem/Components/NameSystemBox',
};

export const Usage = (args: NameSystemBoxProps) => {
  const { name: addressName, resolver, link } = MOCK_NAMES[0];
  return (
    <Box css={{ width: 270 }}>
      <NameSystemBox
        {...args}
        link={link}
        name={addressName}
        resolver={resolver}
        onClear={() => console.log('Clear')}
      />
    </Box>
  );
};

export const Wrapper = (args: NameSystemBoxProps) => {
  const { name: addressName, resolver, link } = MOCK_NAMES[0];

  const [isVisible, setIsVisible] = useState(false);

  return (
    <Box css={{ width: 270 }}>
      <NameSystemWrapper
        isVisible={isVisible}
        element={
          <NameSystemBox
            {...args}
            link={link}
            name={addressName}
            resolver={resolver}
            onClear={() => setIsVisible(false)}
          />
        }
        input={<Button onPress={() => setIsVisible(true)}>Toggle</Button>}
      />
    </Box>
  );
};
