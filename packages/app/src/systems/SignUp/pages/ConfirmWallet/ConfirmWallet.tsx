import { Layout } from '~/systems/Core';

import { MnemonicWrite } from '../../components';
import { useSignUp, useSignUpStepper } from '../../hooks';
import { useMnemonicForm } from '../../hooks/useMnemonicForm';

export function ConfirmWallet() {
  const { handlers, context } = useSignUp();
  const { progressAt } = useSignUpStepper();
  const { error, words, hasError, onChange, onFilled } = useMnemonicForm(
    context.data?.mnemonic
  );

  return (
    <Layout title="Create Wallet" isPublic progress={progressAt(3)}>
      <MnemonicWrite
        title="Confirm phrase"
        subtitle="Write your phrase again to ensure you wrote it down correctly."
        step={3}
        expected={context.data?.mnemonic}
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
