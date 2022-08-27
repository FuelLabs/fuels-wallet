import { Heading, Stack } from "@fuel-ui/react";

export type HeaderProps = {
  title: string;
  subtitle: string;
};

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <Stack gap="$0">
      <Heading as="h2" css={{ margin: 0 }}>
        {title}
      </Heading>
      <Heading
        as="h6"
        css={{ margin: 0, color: "$gray11", textAlign: "center" }}
      >
        {subtitle}
      </Heading>
    </Stack>
  );
}
