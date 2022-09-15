import { Outlet, Route } from "react-router-dom";

import { FaucetDialog } from "../Faucet/index.tsx";

import { Home } from "./pages";

import { Pages, PrivateRoute } from "~/systems/Core";

export const homeRoutes = (
  <Route
    path={Pages.home}
    element={
      <PrivateRoute>
        <Home />
        <Outlet />
      </PrivateRoute>
    }
  >
    <Route path={Pages.faucet} element={<FaucetDialog />} />
  </Route>
);
