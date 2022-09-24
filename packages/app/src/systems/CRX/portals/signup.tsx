import "@fontsource/source-code-pro";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";

import { SignUpPage } from "../pages/SignUp";

createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <SignUpPage />
  </HashRouter>
);
