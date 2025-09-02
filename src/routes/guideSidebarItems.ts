import { Bookings } from "@/pages/user/Bookings";
import type { ISidebarItem } from "@/types";

export const guideSidebarItems: ISidebarItem[] = [
  {
    title: "Guide",
    items: [
      {
        title: "Bookings",
        url: "/guide/bookings",
        component: Bookings,
      },
    ],
  },
];
