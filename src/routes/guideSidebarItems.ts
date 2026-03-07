import ProfilePage from "@/pages/ProfilePage";
import { Bookings } from "@/pages/user/Bookings";
import { AddTour } from "@/pages/admin/AddTour";
import { ManageTour } from "@/pages/admin/ManageTour";
import { User, Calendar, TreePalm, TentTree } from "lucide-react";
import type { ISidebarItem } from "@/types";

export const guideSidebarItems: ISidebarItem[] = [
  {
    title: "Guide",
    items: [
      {
        title: "Profile",
        url: "/guide/profile",
        icon: User,
        component: ProfilePage,
      },
      {
        title: "Bookings",
        url: "/guide/bookings",
        icon: Calendar,
        component: Bookings,
      },
    ],
  },
  {
    title: "Tour Management",
    items: [
      {
        title: "Add Tour",
        url: "/guide/add-tour",
        icon: TreePalm,
        component: AddTour,
      },
      {
        title: "Manage Tour",
        url: "/guide/manage-tour",
        icon: TentTree,
        component: ManageTour,
      },
    ],
  },
];
