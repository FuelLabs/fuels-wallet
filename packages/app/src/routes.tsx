import { Navigate, Route, Routes } from "react-router-dom";

import { homeRoutes } from "~/systems/Home";
import { Pages } from "~/types";

export const routes = (
  <Routes>
    <Route>
      <Route path="*" element={<Navigate to={Pages.home} />} />
      {homeRoutes}
    </Route>
  </Routes>
);
