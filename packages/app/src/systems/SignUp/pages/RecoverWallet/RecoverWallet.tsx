import { Layout } from '~/systems/Core';

import { MnemonicWrite } from '../../components';
import { useSignUp, useSignUpStepper } from '../../hooks';
import { useMnemonicForm } from '../../hooks/useMnemonicForm';

export function RecoverWallet() {
  const { handlers, context } = useSignUp();
  const { progressAt } = useSignUpStepper();
  const { error, words, hasError, onChange, onFilled } = useMnemonicForm();

  return (
    <Layout title="Recovering Wallet" isPublic progress={progressAt(2)}>
      <MnemonicWrite
        title="Recover wallet"
        subtitle="Enter your existing seed phrase to restore your wallet."
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
