import { role } from "@/constants/role";
import { adminSidebarItems } from "@/routes/adminSidebarItems";
import { guideSidebarItems } from "@/routes/guideSidebarItems";
import { userSidebarItems } from "@/routes/userSidebarItems";
import type { TRole } from "@/types";

export const getSidebarItem = (userRole: TRole) => {
  switch (userRole) {
    case role.admin:
      return [...adminSidebarItems];
    case role.user:
      return [...userSidebarItems];
    case role.guide:
      return [...guideSidebarItems];
    default:
      return [];
  }
};
