import { Navigate, Route } from "react-router-dom";

import { WelcomeScreen } from "./pages";

import { Pages } from "~/systems/Core";

export const signUpRoutes = (
  <Route path={`${Pages.signUp}/*`} element={<WelcomeScreen />}>
    <Route index element={<Navigate to={Pages.signUp} />} />
  </Route>
);
