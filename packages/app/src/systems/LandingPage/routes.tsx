import { Route } from "react-router-dom";

import { LandingPage } from "./pages";

import { Pages } from "~/systems/Core";

export const landingPageRoutes = (
  <Route path={Pages.index} element={<LandingPage />} />
);
