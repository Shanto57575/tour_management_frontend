import { App } from "@/App";
import Verify from "@/pages/Verify";
import { About } from "@/pages/About";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { createBrowserRouter, Navigate } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { generateRoutes } from "@/utils/generateRoutes";
import { adminSidebarItems } from "./adminSidebarItems";
import { userSidebarItems } from "./userSidebarItems";
import { withAuth } from "@/utils/withAuth";
import { role } from "@/constants/role";
import type { TRole } from "@/types";
import { UnAuthorized } from "@/pages/UnAuthorized";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "about",
        Component: withAuth(About),
      },
    ],
  },
  {
    path: "/admin",
    Component: withAuth(DashboardLayout, role.super_admin as TRole),
    children: [
      { index: true, element: <Navigate to="/admin/analytics" /> },
      ...generateRoutes(adminSidebarItems),
    ],
  },
  {
    path: "/user",
    Component: withAuth(DashboardLayout, role.user as TRole),
    children: [
      { index: true, element: <Navigate to="/user/bookings" /> },
      ...generateRoutes(userSidebarItems),
    ],
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/verify",
    Component: Verify,
  },
  {
    path: "/unauthorized",
    Component: UnAuthorized,
  },
]);
