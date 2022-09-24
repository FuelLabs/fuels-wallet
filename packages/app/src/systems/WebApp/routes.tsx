import { Navigate, Route, Routes } from "react-router-dom";

import { Pages } from "~/systems/Core";
import { homeRoutes } from "~/systems/Home";
import { landingPageRoutes } from "~/systems/LandingPage";
import { signUpRoutes } from "~/systems/SignUp";

export const routes = (
  <Routes>
    <Route>
      {landingPageRoutes}
      {homeRoutes}
      {signUpRoutes}
      <Route path="*" element={<Navigate to={Pages.wallet} />} />
    </Route>
  </Routes>
);
