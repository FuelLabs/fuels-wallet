import "@fontsource/source-code-pro";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";

import { WalletPage } from "../pages/Wallet";

createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <WalletPage />
  </HashRouter>
);
