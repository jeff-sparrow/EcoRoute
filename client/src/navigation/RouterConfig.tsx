import type { ComponentProps, FC } from "react";
import { lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { AuthProvider } from "./auth-provider";
import { ROUTES } from "../constants/route-constant";

const Loader = (Component: FC) => (props: ComponentProps<typeof Component>) => (
  <Component {...props} />
);

const Home = Loader(lazy(() => import("../pages/home")));
const Layout = Loader(lazy(() => import("../layout")));
const Login = Loader(lazy(() => import("../pages/login")));
const Signup = Loader(lazy(() => import("../pages/signup")));

export const RouterConfig = () => {
  const location = useLocation();

  const background =
    location.state && (location.state.background as typeof location);

  return (
    <Routes location={background || location}>
      <Route path={ROUTES.LOG_IN} element={<Login />} />
      <Route path={ROUTES.SIGN_UP} element={<Signup />} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
};

export default RouterConfig;
