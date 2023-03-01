import { Stack, Input } from '@fuel-ui/react';

import type { UseAssetFormReturn } from '../../hooks/useAssetForm';

import { ControlledField } from '~/systems/Core';

export type AssetFormProps = {
  form: UseAssetFormReturn;
  isEditing: boolean;
  showOnlyId?: boolean;
};

export function AssetForm({ form, isEditing, showOnlyId }: AssetFormProps) {
  const { control, formState } = form;
  return (
    <Stack css={{ width: '100%' }} gap="$4">
      <ControlledField
        control={control}
        name="assetId"
        label="ID"
        isRequired
        isInvalid={Boolean(formState.errors?.assetId)}
        isDisabled={isEditing}
        render={({ field }) => (
          <Input>
            <Input.Field
              {...field}
              aria-label="Asset ID"
              placeholder="ID of asset"
            />
          </Input>
        )}
      />
      {!showOnlyId && (
        <>
          <ControlledField
            control={control}
            name="name"
            label="Name"
            isRequired
            isInvalid={Boolean(formState.errors?.name)}
            render={({ field }) => (
              <Input>
                <Input.Field
                  {...field}
                  aria-label="Asset name"
                  placeholder="Name of asset"
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
                  aria-label="Asset symbol"
                  placeholder="Symbol of asset"
                />
              </Input>
            )}
          />
          <ControlledField
            control={control}
            name="imageUrl"
            label="Image URL"
            isInvalid={Boolean(formState.errors?.imageUrl)}
            render={({ field }) => (
              <Input>
                <Input.Field
                  {...field}
                  aria-label="Asset imageUrl"
                  placeholder="Image URL of asset"
                />
              </Input>
            )}
          />
        </>
      )}
    </Stack>
  );
}
