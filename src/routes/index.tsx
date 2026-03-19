import { App } from "@/App";
import Verify from "@/pages/Verify";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import ApplyGuide from "@/pages/ApplyGuide";
import { createBrowserRouter, Navigate } from "react-router";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { generateRoutes } from "@/utils/generateRoutes";
import { adminSidebarItems } from "./adminSidebarItems";
import { userSidebarItems } from "./userSidebarItems";
import { withAuth, withGuest } from "@/utils/withAuth";
import { role } from "@/constants/role";
import type { TRole } from "@/types";
import { UnAuthorized } from "@/pages/UnAuthorized";
import { guideSidebarItems } from "./guideSidebarItems";
import Home from "@/pages/Home/Home";
import TourDetails from "@/pages/TourDetails";
import { superAdminSidebarItems } from "./superAdminSidebarItems";
import AllPlaces from "@/pages/AllPlaces";
import AllDestinations from "@/pages/AllDestinations";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import PaymentSuccess from "@/pages/PaymentSuccess";
import DestinationDetails from "@/pages/DestinationDetails";

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
        path: "all-destinations",
        Component: AllDestinations,
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
      {
        path: "/destination/:division/:slug",
        Component: DestinationDetails,
      },
      {
        path: "payment/success",
        Component: PaymentSuccess,
      },
      {
        path: "/apply-guide",
        Component: withAuth(ApplyGuide, role.user as TRole),
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
    path: "/guide",
    Component: withAuth(DashboardLayout, role.guide as TRole),
    children: [
      { index: true, element: <Navigate to="/guide/bookings" /> },
      ...generateRoutes(guideSidebarItems),
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
    Component: withGuest(Login),
  },
  {
    path: "/register",
    Component: withGuest(Register),
  },
  {
    path: "/verify",
    Component: Verify,
  },
  {
    path: "/forgot-password",
    Component: withGuest(ForgotPassword),
  },
  {
    path: "/reset-password",
    Component: withGuest(ResetPassword),
  },
  {
    path: "/unauthorized",
    Component: UnAuthorized,
  },
]);
