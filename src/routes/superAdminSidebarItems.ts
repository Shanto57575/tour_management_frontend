import { AddTour } from "@/pages/admin/AddTour";
import { ManageTourType } from "@/pages/admin/ManageTourType";
import { Analytics } from "@/pages/admin/Analytics";
import type { ISidebarItem } from "@/types";
import ManageDivision from "@/pages/admin/ManageDivision";
import { ManageTour } from "@/pages/admin/ManageTour";
import ProfilePage from "@/pages/ProfilePage";

export const superAdminSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Profile",
        url: "/super_admin/profile",
        component: ProfilePage,
      },
      {
        title: "Analytics",
        url: "/super_admin/analytics",
        component: Analytics,
      },
    ],
  },
  {
    title: "Tour Management",
    items: [
      {
        title: "Manage Tour Type",
        url: "/super_admin/add-tour-type",
        component: ManageTourType,
      },
      {
        title: "Manage Division",
        url: "/super_admin/add-division",
        component: ManageDivision,
      },
      {
        title: "Add Tour",
        url: "/super_admin/add-tour",
        component: AddTour,
      },
      {
        title: "Manage Tour",
        url: "/super_admin/manage-tour",
        component: ManageTour,
      },
    ],
  },
];
