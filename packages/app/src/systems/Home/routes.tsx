import { Route } from "react-router-dom";

import { Home } from "./pages";

import { Pages } from "~/systems/Core";

export const homeRoutes = <Route path={Pages.home} element={<Home />} />;
