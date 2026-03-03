import { App } from "@/App";
import Verify from "@/pages/Verify";
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
import { guideSidebarItems } from "./guideSidebarItems";
import Home from "@/pages/Home/Home";
import TourDetails from "@/pages/TourDetails";
import { superAdminSidebarItems } from "./superAdminSidebarItems";
import AllPlaces from "@/pages/AllPlaces";
import About from "@/pages/About";
import Contact from "@/pages/Contact";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        path: "/",
        Component: Home,
      },
      {
        path: "all-places",
        Component: AllPlaces,
      },
      {
        path: "about",
        Component: About,
      },
      {
        path: "contact",
        Component: Contact,
      },
      {
        path: "/tour/:slug",
        Component: TourDetails,
      },
    ],
  },
  {
    path: "/super_admin",
    Component: withAuth(DashboardLayout, role.super_admin as TRole),
    children: [
      { index: true, element: <Navigate to="/super_admin/analytics" /> },
      ...generateRoutes(superAdminSidebarItems),
    ],
  },
  {
    path: "/admin",
    Component: withAuth(DashboardLayout, role.admin as TRole),
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
    path: "/guide",
    Component: withAuth(DashboardLayout, role.guide as TRole),
    children: [
      { index: true, element: <Navigate to="/guide/bookings" /> },
      ...generateRoutes(guideSidebarItems),
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
