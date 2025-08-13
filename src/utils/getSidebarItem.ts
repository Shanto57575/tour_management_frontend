import { role } from "@/constants/role";
import { adminSidebarItems } from "@/routes/adminSidebarItems";
import { userSidebarItems } from "@/routes/userSidebarItems";
import type { TRole } from "@/types";

export const getSidebarItem = (userRole: TRole) => {
  switch (userRole) {
    case role.super_admin || role.admin:
      return [...adminSidebarItems];
    case role.user:
      return [...userSidebarItems];
    default:
      return [];
  }
};
