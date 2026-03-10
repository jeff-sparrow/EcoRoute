import { type FC, type ReactElement } from "react";
import { Box } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../components/header";
import { ROUTES } from "../constants/route-constant";

type SidebarLayoutProps = {
  children?: ReactElement;
};

export const Layout: FC<SidebarLayoutProps> = () => {
  const location = useLocation();
  const isDashboard = location.pathname === ROUTES.DASHBOARD;

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {!isDashboard && <Header />}
      <Outlet />
    </Box>
  );
};

export default Layout;
