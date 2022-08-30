import { useNavigate } from "react-router-dom";

import {
  CreatePassword,
  MnemonicWrite,
  SignUpFailed,
  WalletCreated,
} from "../../components";
import { useSignUp } from "../../hooks";
import { SignUpType } from "../../machines/signUpMachine";

import { Layout } from "~/systems/Core";

export function RecoverWallet() {
  const { state, handlers, context } = useSignUp(SignUpType.recover);
  const navigate = useNavigate();

  return (
    <Layout title="Recovering Wallet" isPublic>
      {state.matches("waitingMnemonic") && (
        <MnemonicWrite
          error={handlers.checkMnemonicError()}
          canProceed={context.isConfirmed}
          onFilled={handlers.confirmMnemonic}
          onNext={handlers.next}
          onCancel={() => navigate("/sign-up")}
        />
      )}
      {(state.matches("addingPassword") || state.hasTag("loading")) && (
        <CreatePassword
          onSubmit={handlers.createManager}
          onCancel={() => navigate("/sign-up")}
          isLoading={state.hasTag("loading")}
        />
      )}
      {state.matches("failed") && <SignUpFailed error={state.context.error} />}
      {state.matches("done") && <WalletCreated account={context.account} />}
    </Layout>
  );
}
