import { Box, Heading, Icon } from '@fuel-ui/react';

export const AssetsTitle = () => {
  return (
    <Box.Flex
      css={{
        marginBottom: '$5',
        flexShrink: 0,
      }}
    >
      <Icon icon="Coins" color="accent9" size={22} />
      <Heading as="h4" css={{ my: '0px', marginLeft: '$3' }} color="white">
        Assets
      </Heading>
    </Box.Flex>
  );
};
