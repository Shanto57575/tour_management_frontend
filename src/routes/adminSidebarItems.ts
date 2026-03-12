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
import ManageDestination from "@/pages/admin/ManageDestination";
import {
  ChartNoAxesCombined,
  MapPinHouse,
  MapPinned,
  Pyramid,
  SquareChartGantt,
  TentTree,
  TreePalm,
  User,
  Users,
  ShieldCheck,
} from "lucide-react";

export const adminSidebarItems: ISidebarItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Profile",
        url: "/admin/profile",
        icon: User,
        component: ProfilePage,
      },
      {
        title: "Analytics",
        url: "/admin/analytics",
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
        url: "/admin/manage-users",
        icon: Users,
        component: ManageUsers,
      },
      {
        title: "Manage Guides",
        url: "/admin/manage-guides",
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
        url: "/admin/manage-bookings",
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
        url: "/admin/add-tour-type",
        icon: Pyramid,
        component: ManageTourType,
      },
      {
        title: "Manage Division",
        url: "/admin/add-division",
        icon: MapPinHouse,
        component: ManageDivision,
      },
      {
        title: "Add Tour",
        url: "/admin/add-tour",
        icon: TreePalm,
        component: AddTour,
      },
      {
        title: "Manage Tour",
        url: "/admin/manage-tour",
        icon: TentTree,
        component: ManageTour,
      },
      {
        title: "Manage Destination",
        url: "/admin/manage-destination",
        icon: MapPinned,
        component: ManageDestination,
      },
    ],
  },
];
