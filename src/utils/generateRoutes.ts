import type { ISidebarItem } from "@/types";

export const generateRoutes = (sidebarItems: ISidebarItem[]) => {
  return sidebarItems.flatMap((section) =>
    section.items.map((item) => ({
      path: item.url,
      Component: item.component,
    }))
  );
};
