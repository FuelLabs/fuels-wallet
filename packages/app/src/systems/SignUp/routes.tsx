import { Navigate, Outlet, Route } from "react-router-dom";

import { CreateWallet, RecoverWallet, WelcomeScreen } from "./pages";

import { Pages, PublicRoute } from "~/systems/Core";

const wrapper = (
  <PublicRoute>
    <Outlet />
  </PublicRoute>
);

export const signUpRoutes = (
  <Route path={`${Pages.signUp}/*`} element={wrapper}>
    <Route index element={<Navigate to={Pages["signUp.welcome"]} />} />
    <Route path={Pages["signUp.welcome"]} element={<WelcomeScreen />} />
    <Route path={Pages["signUp.createWallet"]} element={<CreateWallet />} />
    <Route path={Pages["signUp.recoverWallet"]} element={<RecoverWallet />} />
  </Route>
);
