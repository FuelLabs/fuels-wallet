import { Badge, Tooltip } from '@fuel-ui/react';

type BadgeDeprecatedProps = {
  tooltip: React.ReactNode;
};

export function BadgeDeprecated({ tooltip }: BadgeDeprecatedProps) {
  return (
    <Tooltip content={tooltip} delayDuration={0}>
      <Badge variant="ghost" intent="warning" css={{ fontSize: '0.7rem' }}>
        Deprecated
      </Badge>
    </Tooltip>
  );
}
