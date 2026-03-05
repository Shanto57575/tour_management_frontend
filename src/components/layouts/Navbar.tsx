import { useState } from "react";
import logo from "../../assets/icons/trekOn.png";
import { Link, useNavigate, NavLink } from "react-router";
import { toast } from "sonner";
import { Menu, X, CircleUserRound, LayoutDashboard, LogOut, LogIn } from "lucide-react";
import { authApi, useLogOutMutation } from "@/redux/features/auth/auth.api";
import { useUserInfoQuery } from "@/redux/features/user/user.api";
import { useAppDispatch } from "@/redux/hook";
import { role } from "@/constants/role";
import { AnimatedThemeToggler } from "../animated-theme-toggler";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logout] = useLogOutMutation();
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const { data: userData } = useUserInfoQuery(undefined);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/all-places", label: "All Places" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  let dashboardLink = null;
  if (userData?.data?.role === role.admin) dashboardLink = { href: "/admin", label: "Dashboard" };
  else if (userData?.data?.role === role.user) dashboardLink = { href: "/user", label: "Dashboard" };
  else if (userData?.data?.role === role.super_admin) dashboardLink = { href: "/super_admin", label: "Dashboard" };
  else if (userData?.data?.role === role.guide) dashboardLink = { href: "/guide", label: "Dashboard" };

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

  const isLoggedIn = !!(userData?.data?.email);

  return (
    <header className="sticky top-0 z-50 w-full max-w-7xl mx-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md dark:border-b border-gray-200 dark:border-gray-800 dark:shadow-sm" />

      <div className="relative px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">

          {/* Logo — original size, no text */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} className="w-16 h-16 drop-shadow-md" alt="TrekOn logo" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end={link.href === "/"}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium transition-colors duration-200
                  ${isActive
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-purple-500 dark:bg-purple-400 transition-all duration-300 origin-center ${isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                        }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <div className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
              <AnimatedThemeToggler />
            </div>

            {/* Avatar / User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative flex items-center justify-center w-9 h-9 rounded-full ring-2 ring-purple-200 dark:ring-purple-700 hover:ring-purple-400 dark:hover:ring-purple-500 transition-all duration-200 focus:outline-none overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer">
                  {userData?.data?.picture && !avatarError ? (
                    <>
                      {!avatarLoaded && (
                        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                      )}
                      <img
                        src={userData.data.picture}
                        alt={userData.data.name || "User"}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${avatarLoaded ? "opacity-100" : "opacity-0"}`}
                        onLoad={() => setAvatarLoaded(true)}
                        onError={() => setAvatarError(true)}
                      />
                    </>
                  ) : (
                    <CircleUserRound className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  )}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-56 mt-2  rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-900"
                align="end"
              >
                <DropdownMenuLabel className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 px-3 pt-3 pb-1">
                  My Account
                </DropdownMenuLabel>

                {userData?.data && (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {userData.data.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {userData.data.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800" />
                  </>
                )}

                <DropdownMenuGroup>
                  {dashboardLink && (
                    <DropdownMenuItem
                      asChild
                      className="cursor-pointer text-sm text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg mx-1 focus:bg-gray-100 dark:focus:bg-gray-800 focus:text-purple-600"
                    >
                      <Link to={dashboardLink.href} className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        {dashboardLink.label}
                      </Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator className="bg-gray-100 dark:bg-gray-800" />

                {isLoggedIn ? (
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg mx-1 mb-1 flex items-center gap-2 focus:bg-gray-100 dark:focus:bg-gray-800"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer text-sm text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg mx-1 mb-1 focus:bg-gray-100 dark:focus:bg-gray-800"
                  >
                    <Link to="/login" className="flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      Login
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none cursor-pointer"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen
                ? <X className="w-5 h-5" />
                : <Menu className="w-5 h-5" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden relative overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="px-3 pb-4 pt-2 border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md space-y-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              end={link.href === "/"}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border-l-2
                ${isActive
                  ? "text-purple-600 dark:text-purple-400 border-purple-500 dark:border-purple-400 bg-purple-50/60 dark:bg-purple-950/20"
                  : "text-gray-600 dark:text-gray-300 border-transparent hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* Mobile Auth */}
          <div className="pt-2 mt-1 border-t border-gray-200 dark:border-gray-800">
            {isLoggedIn ? (
              <button
                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-500 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 transition-all duration-200"
              >
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}