import { AddTour } from "@/pages/admin/AddTour";
import { ManageTourType } from "@/pages/admin/ManageTourType";
import { Analytics } from "@/pages/admin/Analytics";
import type { ISidebarItem } from "@/types";
import ManageDivision from "@/pages/admin/ManageDivision";
import { ManageTour } from "@/pages/admin/ManageTour";
import ProfilePage from "@/pages/ProfilePage";
import { ManageUsers } from "@/pages/admin/ManageUsers";
import { ManageBookings } from "@/pages/admin/ManageBookings";
import { ManageGuides } from "@/pages/admin/ManageGuides";
import {
  ChartNoAxesCombined,
  MapPinHouse,
  Pyramid,
  SquareChartGantt,
  TentTree,
  TreePalm,
  User,
  Users,
  ShieldCheck,
  MapPinned,
} from "lucide-react";
import ManageDestination from "@/pages/admin/ManageDestination";

export const superAdminSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Profile",
        url: "/super_admin/profile",
        icon: User,
        component: ProfilePage,
      },
      {
        title: "Analytics",
        url: "/super_admin/analytics",
        icon: ChartNoAxesCombined,
        component: Analytics,
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        title: "Manage Users",
        url: "/super_admin/manage-users",
        icon: Users,
        component: ManageUsers,
      },
      {
        title: "Manage Guides",
        url: "/super_admin/manage-guides",
        icon: ShieldCheck,
        component: ManageGuides,
      },
    ],
  },
  {
    title: "Booking Management",
    items: [
      {
        title: "Manage Bookings",
        url: "/super_admin/manage-bookings",
        icon: SquareChartGantt,
        component: ManageBookings,
      },
    ],
  },
  {
    title: "Tour Management",
    items: [
      {
        title: "Manage Tour Type",
        url: "/super_admin/add-tour-type",
        icon: Pyramid,
        component: ManageTourType,
      },
      {
        title: "Manage Division",
        url: "/super_admin/add-division",
        icon: MapPinHouse,
        component: ManageDivision,
      },
      {
        title: "Add Tour",
        url: "/super_admin/add-tour",
        icon: TreePalm,
        component: AddTour,
      },
      {
        title: "Manage Tour",
        url: "/super_admin/manage-tour",
        icon: TentTree,
        component: ManageTour,
      },
      {
        title: "Manage Destination",
        url: "/super_admin/manage-destination",
        icon: MapPinned,
        component: ManageDestination,
      },
    ],
  },
];
