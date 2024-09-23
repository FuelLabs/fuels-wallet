import { Box, Input } from '@fuel-ui/react';
import { ControlledField } from '~/systems/Core';

import type { UseAssetFormReturn } from '../../hooks/useAssetForm';

export type AssetFormProps = {
  form: UseAssetFormReturn;
  isEditing: boolean;
};

export function AssetForm({ form, isEditing }: AssetFormProps) {
  const { control, formState } = form;
  return (
    <Box.Stack css={{ width: '100%' }} gap="$4">
      <ControlledField
        control={control}
        name="name"
        label="Name"
        isRequired
        isInvalid={Boolean(formState.errors?.name)}
        isDisabled={isEditing}
        render={({ field }) => (
          <Input>
            <Input.Field
              {...field}
              id="search-name"
              aria-label="Asset name"
              placeholder="Asset name"
            />
          </Input>
        )}
      />
      <ControlledField
        control={control}
        name="symbol"
        label="Symbol"
        isRequired
        isInvalid={Boolean(formState.errors?.symbol)}
        render={({ field }) => (
          <Input>
            <Input.Field
              {...field}
              id="search-symbol"
              aria-label="Asset symbol"
              placeholder="Asset symbol"
            />
          </Input>
        )}
      />
      <ControlledField
        control={control}
        name="assetId"
        label="AssetId"
        isRequired
        isInvalid={Boolean(formState.errors?.assetId)}
        render={({ field }) => (
          <Input>
            <Input.Field
              {...field}
              id="search-asset-id"
              aria-label="Asset ID"
              placeholder="Asset ID"
            />
          </Input>
        )}
      />
      <ControlledField
        control={control}
        name="decimals"
        label="Decimals"
        isInvalid={Boolean(formState.errors?.decimals)}
        isRequired
        render={({ field }) => (
          <Input>
            <Input.Field
              {...field}
              id="search-decimals"
              type="number"
              min={0}
              max={19}
              aria-label="Asset decimals"
              placeholder="Number of decimals ex. 9"
            />
          </Input>
        )}
      />
      <ControlledField
        control={control}
        name="icon"
        label="Image URL"
        isInvalid={Boolean(formState.errors?.icon)}
        render={({ field }) => (
          <Input>
            <Input.Field
              {...field}
              id="search-image-url"
              aria-label="Asset image Url"
              placeholder="Asset image URL"
            />
          </Input>
        )}
      />
    </Box.Stack>
  );
}
