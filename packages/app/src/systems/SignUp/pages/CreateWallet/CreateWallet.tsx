import { useNavigate } from 'react-router-dom';

import { CreatePassword, MnemonicRead, MnemonicWrite } from '../../components';
import { useSignUp } from '../../hooks';
import { SignUpType } from '../../machines/signUpMachine';

import { Layout, Pages } from '~/systems/Core';

export function CreateWallet() {
  const { state, handlers, context } = useSignUp(SignUpType.create);
  const navigate = useNavigate();
  console.log({
    state,
    context,
  });
  return (
    <Layout title="Create Wallet" isPublic>
      {(state.matches('addingPassword') || state.hasTag('savingPassword')) && (
        <CreatePassword
          onSubmit={handlers.createPassword}
          onCancel={() => navigate(Pages.signUp())}
          isLoading={state.hasTag('savingPassword')}
        />
      )}
      {state.matches('showingMnemonic') && (
        <MnemonicRead
          words={context.data?.mnemonic}
          onNext={handlers.next}
          onCancel={() => navigate(Pages.signUp())}
        />
      )}
      {(state.matches('waitingMnemonic') ||
        state.matches('creatingWallet')) && (
        <MnemonicWrite
          error={context.isFilled ? context.error : ''}
          canProceed={state.matches('waitingMnemonic.validMnemonic')}
          onFilled={handlers.confirmMnemonic}
          onNext={handlers.createManager}
          onCancel={() => navigate(Pages.signUp())}
          isLoading={state.hasTag('loading')}
        />
      )}
    </Layout>
  );
}
