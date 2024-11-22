import { cssObj } from '@fuel-ui/css';
import { Box, Icon, IconButton, Input, Link, Text } from '@fuel-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { type Maybe, animations, shortAddress } from '~/systems/Core';

const MotionContent = motion(Box);

export type NameSystemBoxProps = {
  link: Maybe<string>;
  name: Maybe<string>;
  resolver: Maybe<string>;
  isVisible?: boolean;
  onClear: () => void;
  children: React.ReactNode;
};

export const NameSystemBox = (props: NameSystemBoxProps) => {
  return (
    <AnimatePresence mode="wait">
      {props.isVisible ? (
        <MotionContent
          {...animations.fadeIn()}
          key="name-system-box"
          as={Input}
          css={styles.addressBox}
        >
          <Link href={props.link ?? ''} isExternal>
            {props.name}
          </Link>
          <Text fontSize="sm">
            {props.resolver &&
              shortAddress(props.resolver, {
                left: 10,
                right: 18,
              })}
          </Text>
          <IconButton
            css={{
              '.fuel_Icon': { color: '$inputBaseIcon !important' },
            }}
            variant="link"
            aria-label="Clear"
            icon={Icon.is('X')}
            onPress={props.onClear}
          />
        </MotionContent>
      ) : (
        <MotionContent key="name-system-children" {...animations.fadeIn()}>
          {props.children}
        </MotionContent>
      )}
    </AnimatePresence>
  );
};

const styles = {
  addressBox: cssObj({
    display: 'flex',
    justifyContent: 'center',
    px: '$3 !important',
    py: '$1 !important',
    flexDirection: 'column',
    position: 'relative',

    '.fuel_Link': {
      fontSize: '$sm',
    },
    '.fuel_Button': {
      position: 'absolute',
      right: '$2',
    },
  }),
};
