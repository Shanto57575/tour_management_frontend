import ProfilePage from "@/pages/ProfilePage";
import { Bookings } from "@/pages/user/Bookings";
import type { ISidebarItem } from "@/types";

export const userSidebarItems: ISidebarItem[] = [
  {
    title: "History",
    items: [
      {
        title: "Profile",
        url: "/user/profile",
        component: ProfilePage,
      },
      {
        title: "Bookings",
        url: "/user/bookings",
        component: Bookings,
      },
    ],
  },
];
