import { AddTour } from "@/pages/admin/AddTour";
import { ManageTourType } from "@/pages/admin/ManageTourType";
import { Analytics } from "@/pages/admin/Analytics";
import type { ISidebarItem } from "@/types";
import ManageDivision from "@/pages/admin/ManageDivision";

// import { lazy } from "react";
// const Analytics = lazy(() => import("@/pages/admin/Analytics")); this way works if component is default

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Analytics",
        url: "/admin/analytics",
        component: Analytics,
      },
    ],
  },
  {
    title: "Tour Management",
    items: [
      {
        title: "Manage Tour Type",
        url: "/admin/add-tour-type",
        component: ManageTourType,
      },
      {
        title: "Manage Division",
        url: "/admin/add-division",
        component: ManageDivision,
      },
      {
        title: "Add Tour",
        url: "/admin/add-tour",
        component: AddTour,
      },
      {
        title: "Manage Tour",
        url: "/admin/add-tour",
        component: AddTour,
      },
    ],
  },
];
