import { Navigate, Route, Routes } from "react-router-dom";

import { Pages } from "~/systems/Core";
import { homeRoutes } from "~/systems/Home";
import { landingPageRoutes } from "~/systems/LandingPage";
import { networkRoutes } from "~/systems/Network";
import { signUpRoutes } from "~/systems/SignUp";

export const routes = (
  <Routes>
    <Route>
      {landingPageRoutes}
      {homeRoutes}
      {networkRoutes}
      {signUpRoutes}
      <Route path="*" element={<Navigate to={Pages.home} />} />
    </Route>
  </Routes>
);
