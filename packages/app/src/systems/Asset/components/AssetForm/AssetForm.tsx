import { Input, Box } from '@fuel-ui/react';

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
    <Box.Stack css={{ width: '100%' }} gap="$4">
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
              placeholder="Asset ID"
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
                  aria-label="Asset symbol"
                  placeholder="Asset symbol"
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
                  aria-label="Asset image Url"
                  placeholder="Asset image URL"
                />
              </Input>
            )}
          />
        </>
      )}
    </Box.Stack>
  );
}
