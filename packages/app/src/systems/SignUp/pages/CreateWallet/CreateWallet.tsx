import { CreatePassword, MnemonicRead } from '../../components';
import { MnemonicConfirm } from '../../components/MnemonicConfirm';
import { useSignUp } from '../../hooks';
import { SignUpType } from '../../machines/signUpMachine';

import { Layout } from '~/systems/Core';

export function CreateWallet() {
  const { state, handlers, context } = useSignUp(SignUpType.create);
  return (
    <Layout title="Create Wallet" isPublic>
      {(state.matches('addingPassword') || state.hasTag('savingPassword')) && (
        <CreatePassword
          onSubmit={handlers.createPassword}
          onCancel={handlers.cancel}
          isLoading={state.hasTag('savingPassword')}
        />
      )}
      {state.matches('showingMnemonic') && (
        <MnemonicRead
          words={context.data?.mnemonic}
          onNext={handlers.next}
          onCancel={handlers.cancel}
        />
      )}
      {(state.matches('waitingMnemonic') ||
        state.matches('fetchingConfirmationWords') ||
        state.matches('confirmingMnemonic') ||
        state.matches('creatingWallet')) && (
        <MnemonicConfirm
          error={context.isFilled ? context.error : ''}
          canProceed={state.matches('waitingMnemonic.validMnemonic')}
          onFilled={handlers.confirmMnemonic}
          onNext={handlers.createManager}
          onCancel={handlers.cancel}
          isLoading={state.hasTag('loading')}
          words={context.data?.mnemonic}
          positions={context.data?.positionsForConfirmation}
          defaultValue={context.data?.mnemonicConfirmation}
        />
      )}
    </Layout>
  );
}
