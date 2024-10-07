import { cssObj } from '@fuel-ui/css';
import { Button, Icon, Tabs } from '@fuel-ui/react';
import { AnimatePresence } from 'framer-motion';
import { Layout, scrollable } from '~/systems/Core';

import { MemoAssetList } from '../../components';
import { useAssets } from '../../hooks';

export function Assets() {
  const state = useAssets();

  const { handlers } = state;

  return (
    <Layout title="Assets">
      <Layout.TopBar />
      <Layout.Content css={styles.content} noBorder>
        <AnimatePresence initial={false} mode="wait">
          <Tabs defaultValue="custom" variant="subtle">
            <Tabs.List css={styles.tabList}>
              <Tabs.Trigger value="custom" aria-label="Custom Assets">
                Custom
              </Tabs.Trigger>
              <Tabs.Trigger value="listed" aria-label="Listed Assets">
                Listed
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="custom">
              <MemoAssetList
                assets={state.assetsCustom}
                showActions
                onRemove={(name: string) => handlers.removeAsset({ name })}
                onEdit={(name: string) => handlers.goToEdit(name)}
                emptyProps={{
                  text: 'No custom assets',
                  supportText: 'Start by adding a new custom asset',
                }}
              />
            </Tabs.Content>
            <Tabs.Content value="listed">
              <MemoAssetList assets={state.assetsListed} showActions />
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

const styles = {
  content: cssObj({
    p: '$0',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',

    '.fuel_Tabs': {
      backgroundColor: 'transparent',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    '.fuel_TabsContent': {
      flex: 1,
      padding: '$0 $0 $2 $4',
      ...scrollable(),
      overflowY: 'scroll !important',
    },
  }),
  tabList: cssObj({
    mx: '$4',
  }),
};
