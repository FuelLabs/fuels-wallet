import { cssObj } from '@fuel-ui/css';
import { Alert } from '@fuel-ui/react';
import { useNavigate } from 'react-router-dom';

import { CreatePassword, MnemonicWrite, SignUpFailed } from '../../components';
import { useSignUp } from '../../hooks';
import { SignUpType } from '../../machines/signUpMachine';

import { Layout, Pages } from '~/systems/Core';

export function RecoverWallet() {
  const { state, handlers, context } = useSignUp(SignUpType.recover);
  const navigate = useNavigate();

  return (
    <Layout title="Recovering Wallet" isPublic>
      <Alert status="warning" css={styles.alert}>
        <Alert.Description>
          This wallet is current on development, and your phrase is not safely
          stored, DO NOT IMPORT YOUR CURRENT SEED PHRASE.
        </Alert.Description>
      </Alert>
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
      {state.matches('failed') && <SignUpFailed error={state.context.error} />}
    </Layout>
  );
}

const styles = {
  alert: cssObj({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    boxShadow: '$lg',
    boxSizing: 'border-box',

    '&, &::after': {
      borderRadius: '$none',
    },
  }),
};
