import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTES } from "../constants/route-constant";
import { useStore } from "../store";

export const AuthProvider = () => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const location = useLocation();



  if (!isAuthenticated) return <Navigate to={ROUTES.LOG_IN} state={{ from: location }} replace />;

  return <Outlet />;
};

export default AuthProvider;
