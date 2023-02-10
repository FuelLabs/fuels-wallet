import { Button, Focus } from '@fuel-ui/react';
import { useNavigate, useParams } from 'react-router-dom';

import { AssetForm } from '../../components/AssetForm';
import { useAsset, useAssets } from '../../hooks';
import type { AssetFormValues } from '../../hooks/useAssetForm';
import { useAssetForm } from '../../hooks/useAssetForm';

import { Layout } from '~/systems/Core';

export function UpsertAsset() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const id = params.id;

  const asset = useAsset(id);
  const { handlers, isLoading } = useAssets();
  const form = useAssetForm({
    defaultValues: {
      name: '',
      symbol: '',
      imageUrl: '',
      ...asset,
      assetId: id || '',
    },
  });

  // only security measure, should not happen by screen flow
  if (asset && !asset.isCustom) return null;

  function onSubmit(data: AssetFormValues) {
    handlers.upsertAsset({ data: { ...data, isCustom: true } });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Layout title={`${asset ? 'Edit' : 'Add'} Asset`}>
        <Layout.TopBar />
        <Focus.Scope autoFocus contain>
          <Layout.Content>
            <AssetForm form={form} isEditing={!!asset} />
          </Layout.Content>
          <Layout.BottomBar>
            <Button color="gray" variant="ghost" onPress={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              type="submit"
              color="accent"
              isDisabled={!form.formState.isValid}
              isLoading={isLoading}
            >
              Save
            </Button>
          </Layout.BottomBar>
        </Focus.Scope>
      </Layout>
    </form>
  );
}
