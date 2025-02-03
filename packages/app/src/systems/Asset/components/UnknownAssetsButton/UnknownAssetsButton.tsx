import { Button } from '@fuel-ui/react';

interface UnknownAssetsButtonProps {
  showUnknown: boolean;
  unknownLength: number | undefined;
  isLoading: boolean;
  toggle: () => void;
}

export function UnknownAssetsButton({
  showUnknown,
  unknownLength,
  isLoading,
  toggle,
}: UnknownAssetsButtonProps) {
  if (!unknownLength) return null;

  return (
    <Button
      size="xs"
      variant="link"
      onPress={toggle}
      aria-label={`${showUnknown ? 'Hide' : 'Show'} unknown assets`}
      aria-disabled={isLoading || !unknownLength}
      disabled={isLoading || !unknownLength}
      hidden={isLoading || !unknownLength}
    >
      {`${showUnknown ? 'Hide' : 'Show'} unknown assets (${unknownLength})`}
    </Button>
  );
}
