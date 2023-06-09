import { MnemonicWrite } from '../../components';
import { useSignUp } from '../../hooks';
import { useMnemonicForm } from '../../hooks/useMnemonicForm';

import { Layout } from '~/systems/Core';

export function ConfirmWallet() {
  const { handlers, context } = useSignUp();
  const { error, words, hasError, onChange, onFilled } = useMnemonicForm(
    context.data?.mnemonic
  );

  return (
    <Layout title="Create Wallet" isPublic>
      <MnemonicWrite
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
