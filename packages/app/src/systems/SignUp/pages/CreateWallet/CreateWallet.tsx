import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { CreatePassword, MnemonicRead, MnemonicWrite } from '../../components';
import { STORAGE_KEY } from '../../components/SignUpProvider';
import { useSignUp } from '../../hooks';
import { SignUpScreen } from '../../hooks/useSignUp';
import { SignUpType } from '../../machines/signUpMachine';

import { Layout, Pages, Storage } from '~/systems/Core';

export function CreateWallet() {
  const { handlers, context } = useSignUp();
  const navigate = useNavigate();

  useEffect(() => {
    Storage.setItem(STORAGE_KEY, SignUpType.create);
  }, []);

  return (
    <Layout title="Create Wallet" isPublic>
      {context.screen === SignUpScreen.showing && (
        <MnemonicRead
          words={context.data?.mnemonic}
          onNext={handlers.next}
          onCancel={() => navigate(Pages.signUp())}
        />
      )}
      {context.screen === SignUpScreen.waiting && (
        <MnemonicWrite
          error={context.isFilled ? context.error : ''}
          canProceed={context.isValidMnemonic}
          onFilled={handlers.confirmMnemonic}
          onNext={handlers.next}
          onCancel={() => navigate(Pages.signUp())}
        />
      )}
      {context.screen === SignUpScreen.password && (
        <CreatePassword
          onSubmit={handlers.createManager}
          onCancel={() => navigate(Pages.signUp())}
          isLoading={context.isLoading}
        />
      )}
    </Layout>
  );
}
