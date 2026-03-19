import { useState, useEffect } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [logout] = useLogOutMutation();
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const { data: userData } = useUserInfoQuery(undefined);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/all-places", label: "Explore Tours" },
    { href: "/about", label: "About Us" },
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
    <header className="sticky top-0 z-50 w-full">
      <div
        className={`absolute inset-0 transition-all duration-500 ease-in-out ${isScrolled
          ? "bg-white/85 dark:bg-gray-950/85 backdrop-blur-lg border-b border-gray-200/80 dark:border-gray-800/80 shadow-sm"
          : "bg-transparent backdrop-blur-none border-b border-transparent"
          }`}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
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
                    : isScrolled
                      ? "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                      : "text-gray-800 dark:text-white/90 hover:text-purple-500 dark:hover:text-purple-400"
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
            {/* Become a Guide */}
            {(!isLoggedIn || userData?.data?.role === role.user) && (
              <Link
                to={isLoggedIn ? "/apply-guide" : "/login"}
                className={`hidden sm:flex items-center justify-center px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-300 ${isScrolled
                  ? "bg-purple-500 dark:bg-purple-700 text-white dark:text-white hover:bg-purple-500 dark:hover:bg-purple-500"
                  : "bg-white/20 dark:bg-white/10 text-purple-700 hover:text-white dark:text-white hover:bg-purple-700 dark:hover:bg-white/20 backdrop-blur-sm border border-purple-500 dark:border-white/20"
                  }`}
              >
                Become a Guide
              </Link>
            )}

            {/* Theme Toggle */}
            <div
              className={`flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-200 ${isScrolled
                ? "hover:bg-gray-100 dark:hover:bg-gray-800"
                : "hover:bg-white/20 dark:hover:bg-white/10"
                }`}
            >
              <AnimatedThemeToggler />
            </div>

            {/* Avatar / User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`relative flex items-center justify-center w-9 h-9 rounded-full ring-2 transition-all duration-200 focus:outline-none overflow-hidden cursor-pointer ${isScrolled
                    ? "ring-purple-200 dark:ring-purple-700 hover:ring-purple-400 dark:hover:ring-purple-500 bg-gray-100 dark:bg-gray-800"
                    : "ring-white/40 dark:ring-white/30 hover:ring-white/70 dark:hover:ring-white/50 bg-white/20 dark:bg-white/10"
                    }`}
                >
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
                    <CircleUserRound
                      className={`w-5 h-5 transition-colors duration-200 ${isScrolled
                        ? "text-gray-500 dark:text-gray-400"
                        : "text-gray-700 dark:text-white/80"
                        }`}
                    />
                  )}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-56 mt-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl bg-white dark:bg-gray-900"
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
              className={`md:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200 focus:outline-none cursor-pointer ${isScrolled
                ? "text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                : "text-gray-800 dark:text-white hover:text-purple-500 dark:hover:text-purple-300 hover:bg-white/20 dark:hover:bg-white/10"
                }`}
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden relative overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div
          className={`px-3 pb-4 pt-2 border-t backdrop-blur-lg space-y-1 transition-all duration-500 ${isScrolled
            ? "bg-white/95 dark:bg-gray-950/95 border-gray-200 dark:border-gray-800"
            : "bg-white/80 dark:bg-gray-950/80 border-white/20 dark:border-white/10"
            }`}
        >
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
                  : "text-gray-700 dark:text-gray-200 border-transparent hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {/* Mobile Auth & Guide Actions */}
          <div className="pt-2 mt-1 border-t border-gray-200 dark:border-gray-800 space-y-2">
            {(!isLoggedIn || userData?.data?.role === role.user) && (
              <Link
                to={isLoggedIn ? "/apply-guide" : "/login"}
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-800/50 transition-all duration-200"
              >
                Become a Guide
              </Link>
            )}

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