import { cssObj } from '@fuel-ui/css';
import { Box, Button, Focus, Text } from '@fuel-ui/react';
import { isB256 } from 'fuels';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Layout } from '~/systems/Core';

import { AssetItem } from '../../components';
import { AssetForm } from '../../components/AssetForm';
import { useAsset, useAssets } from '../../hooks';
import type { AssetFormValues } from '../../hooks/useAssetForm';
import { useAssetForm } from '../../hooks/useAssetForm';
import useFuelAsset from '../../hooks/useFuelAsset';

export function UpsertAsset() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const params = useParams<{ name: string; assetId: string }>();
  const name = params.name;

  const asset = useAsset(name);
  const isEditing = !!asset;
  const fuelAsset = useFuelAsset({ asset });
  const { handlers, isLoading } = useAssets();
  const form = useAssetForm({
    defaultValues: {
      name: state?.name || '',
      symbol: state?.symbol || '',
      icon: '',
      ...asset,
      decimals: state?.decimals || fuelAsset?.decimals || 0,
      assetId: fuelAsset?.assetId || params.assetId || '',
    },
  });
  const formAssetId = form.watch('assetId');
  const dupeAsset = useAsset(formAssetId);

  // only security measure, should not happen by screen flow
  if (asset && !asset.isCustom) return null;

  // make sure we disable button if form is not valid OR if has a dupe asset while creating new asset
  const shouldDisableButton = !!(
    !form.formState.isValid ||
    (!isEditing && dupeAsset)
  );

  function onSubmit(data: AssetFormValues) {
    if (isEditing) {
      handlers.updateAsset({
        name: data.name,
        data: { ...data, isCustom: true },
      });
    } else {
      handlers.addAsset({ data });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} autoComplete="off">
      <Layout title={`${isEditing ? 'Edit' : 'Add'} Asset`}>
        <Layout.TopBar />
        <Focus.Scope autoFocus>
          <Layout.Content>
            <AssetForm form={form} isEditing={isEditing} />
            {!isEditing && dupeAsset && (
              <Box css={styles.duplicateAsset}>
                <Text color="intentsError9">Asset already exists</Text>
                <AssetItem
                  asset={dupeAsset}
                  showActions
                  onEdit={async (assetId: string) => {
                    handlers.goToEdit(assetId, { eraseLastNavigation: true });
                  }}
                />
              </Box>
            )}
          </Layout.Content>
          <Layout.BottomBar>
            <Button variant="ghost" onPress={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              type="submit"
              intent="primary"
              isDisabled={shouldDisableButton}
              isLoading={isLoading}
              aria-label="Save Asset"
            >
              Save
            </Button>
          </Layout.BottomBar>
        </Focus.Scope>
      </Layout>
    </form>
  );
}

const styles = {
  duplicateAsset: cssObj({
    '& > p': {
      mt: '$2',
      ml: '$1',
      mb: '$3',
    },
  }),
};
