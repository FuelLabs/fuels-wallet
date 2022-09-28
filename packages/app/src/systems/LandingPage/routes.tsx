import { Route } from "react-router-dom";

import { Pages } from "../Core/types";

import { LandingPage } from "./pages";

export const landingPageRoutes = (
  <Route path={Pages.index()} element={<LandingPage />} />
);
