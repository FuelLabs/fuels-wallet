import { cssObj } from '@fuel-ui/css';
import {
  Avatar,
  Box,
  Icon,
  IconButton,
  Input,
  Link,
  Text,
} from '@fuel-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { type Maybe, animations, shortAddress } from '~/systems/Core';

const MotionContent = motion(Box);

export type NameSystemWrapperProps = {
  isVisible?: boolean;
  element: React.ReactNode;
  input: React.ReactNode;
};

export type NameSystemBoxProps = {
  link: Maybe<string>;
  name: Maybe<string>;
  resolver: Maybe<string>;
  onClear: () => void;
};

export const NameSystemWrapper = (props: NameSystemWrapperProps) => (
  <AnimatePresence mode="wait">
    {props.isVisible ? (
      <MotionContent {...animations.fadeIn()} key="name-system-primary">
        {props.element}
      </MotionContent>
    ) : (
      <MotionContent {...animations.fadeIn()} key="name-system-secondary">
        {props.input}
      </MotionContent>
    )}
  </AnimatePresence>
);

export const NameSystemBox = (props: NameSystemBoxProps) => {
  return (
    <Box as={Input} css={styles.addressBox}>
      <Avatar.Generated size="xsm" hash={props.resolver ?? ''} />
      <Box.Flex wrap="wrap" direction="column" justify="center">
        <Link href={props.link ?? ''} isExternal>
          {props.name}
        </Link>
        <Text fontSize="xs">
          {props.resolver &&
            shortAddress(props.resolver, {
              left: 10,
              right: 10,
            })}
        </Text>
      </Box.Flex>
      <IconButton
        variant="link"
        aria-label="Clear"
        icon={Icon.is('X')}
        onPress={props.onClear}
      />
    </Box>
  );
};

const styles = {
  addressBox: cssObj({
    display: 'flex',
    px: '$3 !important',
    py: '$1 !important',
    alignItems: 'center',
    gap: '$3',
    flexDirection: 'row',
    position: 'relative',
    '.fuel_Link': {
      fontSize: '$sm',
    },
    '.fuel_Button': {
      position: 'absolute',
      right: '$2',
    },
    '.fuel_Avatar': {
      width: 30,
      height: 30,
    },
    '.fuel_Icon': {
      color: '$inputBaseIcon !important',
    },
  }),
};
