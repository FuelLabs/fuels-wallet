import { useEffect } from 'react';

import { CreatePassword, MnemonicWrite, SignUpFailed } from '../../components';
import { STORAGE_KEY } from '../../components/SignUpProvider';
import { useSignUp } from '../../hooks';
import { SignUpScreen } from '../../hooks/useSignUp';
import { SignUpType } from '../../machines/signUpMachine';

import { Storage, Layout } from '~/systems/Core';

export function RecoverWallet() {
  const { handlers, context } = useSignUp();

  useEffect(() => {
    Storage.setItem(STORAGE_KEY, SignUpType.recover);
  }, []);

  return (
    <Layout title="Recovering Wallet" isPublic>
      {context.screen === SignUpScreen.waiting && (
        <MnemonicWrite
          error={context.isFilled ? context.error : ''}
          canProceed={context.isValidMnemonic}
          onFilled={handlers.confirmMnemonic}
          onNext={handlers.next}
          onCancel={handlers.reset}
          enableChangeFormat={true}
        />
      )}
      {context.screen === SignUpScreen.password && (
        <CreatePassword
          onSubmit={handlers.createManager}
          onCancel={handlers.reset}
          isLoading={context.isLoading}
        />
      )}
      {context.screen === SignUpScreen.failed && (
        <SignUpFailed error={context.error} />
      )}
    </Layout>
  );
}
