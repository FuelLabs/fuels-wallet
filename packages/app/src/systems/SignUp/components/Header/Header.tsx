import { cssObj } from '@fuel-ui/css';
import { Box, Heading } from '@fuel-ui/react';

export type HeaderProps = {
  title: string;
  subtitle?: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <Box.Stack css={styles.root}>
      <Heading as="h2" css={{ margin: 0 }}>
        {title}
      </Heading>
      {subtitle && (
        <Heading
          as="h3"
          css={{
            margin: 0,
            color: '$intentsBase11',
            fontSize: '$lg',
          }}
        >
          {subtitle}
        </Heading>
      )}
    </Box.Stack>
  );
}

const styles = {
  root: cssObj({
    width: '$full',
    gap: '$0',
  }),
};
