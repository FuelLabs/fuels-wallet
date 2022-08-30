import { useNavigate } from "react-router-dom";

import {
  CreatePassword,
  MnemonicRead,
  MnemonicWrite,
  WalletCreated,
} from "../../components";
import { useCreateWallet } from "../../hooks";

import { Layout } from "~/systems/Core";

export function CreateWallet() {
  const { state, handlers, context } = useCreateWallet();
  const navigate = useNavigate();

  return (
    <Layout title="Create Wallet" isPublic>
      {state.matches("showingMnemonic") && (
        <MnemonicRead
          words={context.data?.mnemonic}
          onNext={handlers.next}
          onCancel={() => navigate("/sign-up")}
        />
      )}
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
      {state.matches("done") && <WalletCreated account={context.account} />}
    </Layout>
  );
}
