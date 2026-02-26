import type { ComponentProps, FC } from "react";
import { lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { AuthProvider } from "./auth-provider";

const Loader = (Component: FC) => (props: ComponentProps<typeof Component>) => (
  <Component {...props} />
);

const Home = Loader(lazy(() => import("../pages/home")));
const Layout = Loader(lazy(() => import("../layout")));

export const RouterConfig = () => {
  const location = useLocation();

  const background =
    location.state && (location.state.background as typeof location);

  return (
    <Routes location={background || location}>
      <Route element={<AuthProvider />}>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default RouterConfig;
