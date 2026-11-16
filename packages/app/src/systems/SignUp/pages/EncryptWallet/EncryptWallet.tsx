import { Layout } from '~/systems/Core';

import { CreatePassword } from '../../components';
import { useSignUp, useSignUpStepper } from '../../hooks';
import { SignUpType } from '../../machines/signUpMachine';

export function EncryptWallet() {
  const { handlers, context } = useSignUp();
  const { progressAt } = useSignUpStepper();
  const step = context.signUpType === SignUpType.create ? 4 : 3;

  return (
    <Layout title="Encrypt Wallet" isPublic progress={progressAt(step)}>
      <CreatePassword
        step={step}
        onSubmit={handlers.createManager}
        onCancel={handlers.reset}
        isLoading={context.isLoading}
      />
    </Layout>
  );
}
