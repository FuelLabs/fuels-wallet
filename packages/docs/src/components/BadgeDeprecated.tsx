import { Badge, HStack, Icon, Tooltip } from '@fuel-ui/react';

type BadgeDeprecatedProps = {
  tooltip: React.ReactNode;
};

export function BadgeDeprecated({ tooltip }: BadgeDeprecatedProps) {
  return (
    <Tooltip content={tooltip} delayDuration={0}>
      <Badge
        as="div"
        variant="ghost"
        intent="warning"
        css={{
          fontSize: '0.7rem',
          lineHeight: 'normal',
          display: 'inline-flex',
          alignItems: 'center',
          flexDirection: 'row',
          columnGap: '$1',
        }}
      >
        <Icon
          icon="HelpCircle"
          className="main-icon"
          aria-label="Menu Icon"
          size={14}
        />
        <span>Deprecated</span>
      </Badge>
    </Tooltip>
  );
}
