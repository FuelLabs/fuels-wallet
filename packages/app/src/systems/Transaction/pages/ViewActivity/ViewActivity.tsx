import { Stack } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';

import { ActivityList } from '../../components/ActivityList/ActivityList';

import { Layout } from '~/systems/Core';

export function ViewActivity() {
  const navigate = useNavigate();

  return (
    <Layout title="Activity" isLoading={false}>
      <Layout.TopBar onBack={() => navigate(-1)} />
      <Layout.Content>
        <Stack gap="$4">
          <ActivityList transactions={[]} />
        </Stack>
      </Layout.Content>
    </Layout>
  );
}
