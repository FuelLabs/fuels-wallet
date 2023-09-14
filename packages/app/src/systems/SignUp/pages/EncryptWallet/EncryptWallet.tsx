import { Layout } from '~/systems/Core';

import { CreatePassword } from '../../components';
import { useSignUp } from '../../hooks';
import { SignUpType } from '../../machines/signUpMachine';

export function EncryptWallet() {
  const { handlers, context } = useSignUp();
  const step = context.signUpType === SignUpType.create ? 4 : 3;

  return (
    <Layout title="Encrypt Wallet" isPublic>
      <CreatePassword
        step={step}
        onSubmit={handlers.createManager}
        onCancel={handlers.reset}
        isLoading={context.isLoading}
      />
    </Layout>
  );
}
