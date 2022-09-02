import { Route } from "react-router-dom";

import { Home } from "./pages";

import { Pages, PrivateRoute } from "~/systems/Core";

export const homeRoutes = (
  <Route
    path={Pages.home}
    element={
      <PrivateRoute>
        <Home />
      </PrivateRoute>
    }
  />
);
