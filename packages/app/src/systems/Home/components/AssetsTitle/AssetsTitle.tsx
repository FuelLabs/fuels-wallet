import { Box, Heading, Icon } from '@fuel-ui/react';

export const AssetsTitle = () => {
  return (
    <Box.Flex
      css={{
        flexShrink: 0,
      }}
    >
      <Icon icon="Coins" color="brand" size={22} />
      <Heading
        as="h5"
        css={{ my: '0px', marginLeft: '$3' }}
        color="textHeading"
      >
        Assets
      </Heading>
    </Box.Flex>
  );
};
