import { useEffect } from "react";

import { indexPage, openTab } from "../../utils";

import { routes } from "./routes";

import { useIsLogged } from "~/systems/Account";
import { PageLinks, Providers } from "~/systems/Core";

export function WalletPage() {
  const isLoggedIn = useIsLogged();

  useEffect(() => {
    if (!isLoggedIn) {
      const welcomeUrl = chrome.runtime.getURL(
        indexPage(PageLinks.signUpWelcome)
      );
      openTab(welcomeUrl);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return null;
  }

  return <Providers>{routes}</Providers>;
}
