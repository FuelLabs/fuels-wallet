import { Icon, IconButton } from "@fuel-ui/react";

type VisibilityButtonProps = {
  isHidden?: boolean;
  onHide?: () => void;
  onShow?: () => void;
};

export function VisibilityButton({
  isHidden,
  onHide,
  onShow,
}: VisibilityButtonProps) {
  return (
    <IconButton
      onPress={isHidden ? onShow : onHide}
      size="xs"
      variant="link"
      color="gray"
      icon={
        <Icon
          size={18}
          {...(isHidden
            ? {
                color: "accent9",
                icon: "EyeSlash",
              }
            : {
                color: "gray8",
                icon: "Eye",
              })}
        />
      }
      aria-label={isHidden ? "Show" : "Hide"}
    />
  );
}
