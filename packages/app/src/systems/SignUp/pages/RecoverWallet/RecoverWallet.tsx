import { Layout } from '~/systems/Core';

import { MnemonicWrite } from '../../components';
import { useSignUp } from '../../hooks';
import { useMnemonicForm } from '../../hooks/useMnemonicForm';

export function RecoverWallet() {
  const { handlers, context } = useSignUp();
  const { error, words, hasError, onChange, onFilled } = useMnemonicForm();

  return (
    <Layout title="Recovering Wallet" isPublic>
      <MnemonicWrite
        title="Recover wallet"
        subtitle="Write your existing seed-phrase to restore your wallet."
        step={2}
        error={error || context.error}
        canProceed={!hasError}
        onFilled={onFilled}
        onChange={onChange}
        onNext={() => handlers.importMnemonic(words)}
        onCancel={handlers.reset}
        enableChangeFormat={true}
      />
    </Layout>
  );
}
