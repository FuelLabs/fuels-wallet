import { MnemonicRead } from '../../components';
import { useSignUp } from '../../hooks';

import { Layout } from '~/systems/Core';

export function BackupWallet() {
  const { handlers, context } = useSignUp();

  return (
    <Layout title="Backup Wallet" isPublic>
      <MnemonicRead
        step={2}
        words={context.data?.mnemonic}
        onNext={handlers.next}
        onCancel={handlers.reset}
      />
    </Layout>
  );
}
