import { Outlet, Route } from "react-router-dom";

import { PrivateRoute } from "../Core/components/PrivateRoute";
import { Pages } from "../Core/types";
import { FaucetDialog } from "../Faucet/components";

import { Home } from "./pages";

export const homeRoutes = (
  <Route
    path={Pages.home()}
    element={
      <PrivateRoute>
        <Home />
        <Outlet />
      </PrivateRoute>
    }
  >
    <Route path={Pages.faucet()} element={<FaucetDialog />} />
  </Route>
);
