import { Layout } from '~/systems/Core';

import { MnemonicWrite } from '../../components';
import { useSignUp } from '../../hooks';
import { useMnemonicForm } from '../../hooks/useMnemonicForm';

export function ConfirmWallet() {
  const { handlers, context } = useSignUp();
  const { error, words, hasError, onChange, onFilled } = useMnemonicForm(
    context.data?.mnemonic
  );

  return (
    <Layout title="Create Wallet" isPublic>
      <MnemonicWrite
        title="Confirm phrase"
        subtitle="Write your phrase again to ensure you wrote it down correctly."
        step={3}
        error={error || context.error}
        canProceed={!hasError}
        onFilled={onFilled}
        onChange={onChange}
        onNext={() => handlers.confirmMnemonic(words)}
        onCancel={handlers.reset}
      />
    </Layout>
  );
}
