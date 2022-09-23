import { Outlet, Route } from "react-router-dom";

import { Networks, UpdateNetwork } from "./pages";
import { AddNetwork } from "./pages/AddNetwork";

import { Pages, PrivateRoute } from "~/systems/Core";

const wrapper = (
  <PrivateRoute>
    <Outlet />
  </PrivateRoute>
);

export const networkRoutes = (
  <Route path={`${Pages.networks}/*`} element={wrapper}>
    <Route index element={<Networks />} />
    <Route path={Pages.updateNetwork} element={<UpdateNetwork />} />
    <Route path={Pages.addNetwork} element={<AddNetwork />} />
  </Route>
);
