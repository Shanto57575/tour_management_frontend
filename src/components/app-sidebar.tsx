import * as React from "react";
import Logo from "../assets/icons/trekOn.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation, useNavigate } from "react-router";
import { getSidebarItem } from "@/utils/getSidebarItem";
import { useUserInfoQuery } from "@/redux/features/user/user.api";
import { AnimatedThemeToggler } from "./animated-theme-toggler";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { authApi, useLogOutMutation } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: userData } = useUserInfoQuery(undefined);
  const location = useLocation();
  const [logout] = useLogOutMutation();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { setOpenMobile, isMobile } = useSidebar();

  const data = {
    navMain: getSidebarItem(userData?.data?.role),
  };

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    try {
      const result = await logout(undefined).unwrap();
      if (result?.success) {
        navigate("/login");
        toast.success("Logged out successfully", { id: toastId });
        dispatch(authApi.util.resetApiState());
      }
    } catch {
      toast.error("Failed to logout", { id: toastId });
    }
  };


  return (
    <Sidebar {...props} className="border-r border-sidebar-border/50 shadow-sm bg-sidebar/95 backdrop-blur-md">
      <SidebarHeader className="p-4 pt-6 mx-2 flex flex-row items-center justify-between border-b-2 border-transparent">
        <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 cursor-pointer">
          <img className="w-16 h-16 drop-shadow-md" src={Logo} alt={"logo"} />
        </Link>
        <div className="flex items-center justify-center p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <AnimatedThemeToggler />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 pt-6">
        {data.navMain?.map((group) => (
          <SidebarGroup key={group.title} className="px-0">
            <SidebarGroupLabel className="text-xs font-bold text-purple-500 dark:text-purple-400 uppercase tracking-widest mb-3 px-3">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1.5 flex-col">
                {group.items?.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      className="rounded-xl h-11 px-4 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white data-[active=true]:bg-purple-100 data-[active=true]:text-purple-700 dark:data-[active=true]:bg-purple-900/40 dark:data-[active=true]:text-purple-400 data-[active=true]:font-semibold data-[active=true]:shadow-sm group cursor-pointer"
                    >
                      <Link
                        to={item.url}
                        className="flex items-center gap-3 w-full"
                        onClick={() => {
                          if (isMobile) {
                            setOpenMobile(false);
                          }
                        }}
                      >
                        <span>{item.icon && <item.icon />}</span>
                        <span className="relative">
                          {item.title}
                          {location.pathname === item.url && (
                            <span className="absolute -left-4 top-1/2 content-[''] h-1.5 w-1.5 rounded-full bg-purple-600 dark:bg-purple-400 -translate-y-1/2" />
                          )}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-3 border-t border-sidebar-border/50">
        <Button
          onClick={handleLogout}
          className="w-full hover:bg-purple-700 cursor-pointer"
        >
          Logout
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
