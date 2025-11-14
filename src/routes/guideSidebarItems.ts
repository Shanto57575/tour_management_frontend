import ProfilePage from "@/pages/ProfilePage";
import { Bookings } from "@/pages/user/Bookings";
import type { ISidebarItem } from "@/types";

export const guideSidebarItems: ISidebarItem[] = [
  {
    title: "Guide",
    items: [
      {
        title: "Profile",
        url: "/guide/profile",
        component: ProfilePage,
      },
      {
        title: "Bookings",
        url: "/guide/bookings",
        component: Bookings,
      },
    ],
  },
];
