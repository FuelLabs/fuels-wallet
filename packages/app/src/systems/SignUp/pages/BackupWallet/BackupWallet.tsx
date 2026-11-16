import { Layout } from '~/systems/Core';

import { MnemonicRead } from '../../components';
import { useSignUp, useSignUpStepper } from '../../hooks';

export function BackupWallet() {
  const { handlers, context } = useSignUp();
  const { progressAt } = useSignUpStepper();

  return (
    <Layout title="Backup Wallet" isPublic progress={progressAt(2)}>
      <MnemonicRead
        step={2}
        words={context.data?.mnemonic}
        onNext={handlers.next}
        onCancel={handlers.reset}
      />
    </Layout>
  );
}
