import { cssObj } from '@fuel-ui/css';
import { Text } from '@fuel-ui/react';
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
      <Text css={styles.alert} leftIcon="AlertTriangle">
        This wallet is current on development, and your phrase is not safely
        stored, DO NOT IMPORT YOUR CURRENT SEED PHRASE.
      </Text>
      {state.matches('waitingMnemonic') && (
        <MnemonicWrite
          error={context.isFilled ? context.error : ''}
          canProceed={state.matches('waitingMnemonic.validMnemonic')}
          onFilled={handlers.confirmMnemonic}
          onNext={handlers.next}
          onCancel={() => navigate(Pages.signUp())}
          enableChangeFormat={true}
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
    boxSizing: 'border-box',
    bg: '$semanticGhostWarningBg',
    color: '$semanticGhostWarningColor',
    padding: '$3',
    justifyContent: 'center',

    '& .fuel_Icon': {
      color: '$semanticGhostWarningIcon',
    },

    '&, &::after': {
      borderRadius: '$none',
    },
  }),
};
