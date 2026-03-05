import ProfilePage from "@/pages/ProfilePage";
import { Bookings } from "@/pages/user/Bookings";
import type { ISidebarItem } from "@/types";
import { SquareChartGantt, User } from "lucide-react";

export const userSidebarItems: ISidebarItem[] = [
  {
    title: "History",
    items: [
      {
        title: "Profile",
        url: "/user/profile",
        icon: User,
        component: ProfilePage,
      },
      {
        title: "Bookings",
        url: "/user/bookings",
        icon: SquareChartGantt,
        component: Bookings,
      },
    ],
  },
];
