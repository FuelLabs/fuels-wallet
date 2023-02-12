import { Button, Icon, Tabs } from '@fuel-ui/react';
import { AnimatePresence } from 'framer-motion';

import { AssetList } from '../../components';
import { useAssets } from '../../hooks';

import { Layout } from '~/systems/Core';

export function Assets() {
  const state = useAssets();

  const { handlers } = state;

  return (
    <Layout title="Assets">
      <Layout.TopBar />
      <Layout.Content>
        <AnimatePresence initial={false} mode="wait">
          <Tabs defaultValue="listed">
            <Tabs.List>
              <Tabs.Trigger value="listed" aria-label="Listed Assets">
                Listed
              </Tabs.Trigger>
              <Tabs.Trigger value="custom" aria-label="Custom Assets">
                Custom
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="listed">
              <AssetList assets={state.assetsListed} />
            </Tabs.Content>
            <Tabs.Content value="custom">
              <AssetList
                assets={state.assetsCustom}
                showActions
                onRemove={(assetId: string) =>
                  handlers.removeAsset({ assetId })
                }
                onEdit={(assetId: string) => handlers.goToEdit(assetId)}
              />
            </Tabs.Content>
          </Tabs>
        </AnimatePresence>
      </Layout.Content>
      <Layout.BottomBar>
        <Button
          aria-label="Add Asset"
          onPress={handlers.goToAdd}
          leftIcon={Icon.is('Plus')}
          variant="ghost"
        >
          Add Asset
        </Button>
      </Layout.BottomBar>
    </Layout>
  );
}
