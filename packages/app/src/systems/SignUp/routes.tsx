import { Navigate, Outlet, Route } from "react-router-dom";

import { PublicRoute } from "../Core/components/PublicRoute";
import { Pages } from "../Core/types";

import { CreateWallet, RecoverWallet, WelcomeScreen } from "./pages";

const wrapper = (
  <PublicRoute>
    <Outlet />
  </PublicRoute>
);

export const signUpRoutes = (
  <Route path={Pages.signUp()} element={wrapper}>
    <Route index element={<Navigate to={Pages.signUpWelcome()} />} />
    <Route path={Pages.signUpWelcome()} element={<WelcomeScreen />} />
    <Route path={Pages.signUpCreateWallet()} element={<CreateWallet />} />
    <Route path={Pages.signUpRecoverWallet()} element={<RecoverWallet />} />
  </Route>
);
