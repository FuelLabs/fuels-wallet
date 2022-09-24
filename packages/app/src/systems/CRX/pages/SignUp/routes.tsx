import { Route, Routes } from "react-router-dom";

import { Pages } from "~/systems/Core";
import { signUpRoutes } from "~/systems/SignUp";

export const routes = (
  <Routes>
    <Route>
      {signUpRoutes}
      <Route
        path={Pages.wallet}
        action={() => {
          window.close();
        }}
      />
    </Route>
  </Routes>
);
