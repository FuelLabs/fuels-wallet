import { cssObj } from '@fuel-ui/css';
import { Text } from '@fuel-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { CreatePassword, MnemonicWrite, SignUpFailed } from '../../components';
import { STORAGE_KEY } from '../../components/SignUpProvider';
import { useSignUp } from '../../hooks';
import { SignUpScreen } from '../../hooks/useSignUp';
import { SignUpType } from '../../machines/signUpMachine';

import { Storage, Layout, Pages } from '~/systems/Core';

export function RecoverWallet() {
  const { handlers, context } = useSignUp();
  const navigate = useNavigate();

  useEffect(() => {
    Storage.setItem(STORAGE_KEY, SignUpType.create);
  }, []);

  return (
    <Layout title="Recovering Wallet" isPublic>
      <Text css={styles.alert} leftIcon="AlertTriangle">
        This wallet is in development, and your phrase is not safely stored. DO
        NOT IMPORT YOUR CURRENT SEED PHRASE.
      </Text>
      {context.screen === SignUpScreen.waiting && (
        <MnemonicWrite
          error={context.isFilled ? context.error : ''}
          canProceed={context.isValidMnemonic}
          onFilled={handlers.confirmMnemonic}
          onNext={handlers.next}
          onCancel={() => navigate(Pages.signUp())}
          enableChangeFormat={true}
        />
      )}
      {context.screen === SignUpScreen.password && (
        <CreatePassword
          onSubmit={handlers.createManager}
          onCancel={() => navigate(Pages.signUp())}
          isLoading={context.isLoading}
        />
      )}
      {context.screen === SignUpScreen.failed && (
        <SignUpFailed error={context.error} />
      )}
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
