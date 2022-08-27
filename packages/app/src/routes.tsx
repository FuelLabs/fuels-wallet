import { Navigate, Route, Routes } from "react-router-dom";

import { Pages } from "~/systems/Core";
import { homeRoutes } from "~/systems/Home";
import { signUpRoutes } from "~/systems/SignUp";

export const routes = (
  <Routes>
    <Route>
      <Route path="*" element={<Navigate to={Pages.home} />} />
      {homeRoutes}
      {signUpRoutes}
    </Route>
  </Routes>
);
