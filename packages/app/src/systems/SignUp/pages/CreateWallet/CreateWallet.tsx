import { useNavigate } from 'react-router-dom';

import { CreatePassword, MnemonicRead, MnemonicWrite } from '../../components';
import { useSignUp } from '../../hooks';
import { SignUpType } from '../../machines/signUpMachine';

import { Layout, Pages } from '~/systems/Core';

export function CreateWallet() {
  const { state, handlers, context } = useSignUp(SignUpType.create);
  const navigate = useNavigate();

  return (
    <Layout title="Create Wallet" isPublic>
      {state.matches('showingMnemonic') && (
        <MnemonicRead
          words={context.data?.mnemonic}
          onNext={handlers.next}
          onCancel={() => navigate(Pages.signUp())}
        />
      )}
      {state.matches('waitingMnemonic') && (
        <MnemonicWrite
          error={handlers.checkMnemonicError()}
          canProceed={context.isConfirmed}
          onFilled={handlers.confirmMnemonic}
          onNext={handlers.next}
          onCancel={() => navigate(Pages.signUp())}
        />
      )}
      {(state.matches('addingPassword') || state.hasTag('loading')) && (
        <CreatePassword
          onSubmit={handlers.createManager}
          onCancel={() => navigate(Pages.signUp())}
          isLoading={state.hasTag('loading')}
        />
      )}
    </Layout>
  );
}
