import { useState } from "react";
import logo from "../../assets/icons/trekOn.png";
import { Link, useNavigate, NavLink } from "react-router";
import { toast } from "sonner";
import { AlignJustify, CircleUserRound, X } from "lucide-react";
import {
  authApi,
  useLogOutMutation,
  useUserInfoQuery,
} from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { Button } from "../ui/button";
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

  const { data: userData } = useUserInfoQuery(undefined);

  const navigate = useNavigate();

  const navLinks = [
    { href: "/", label: "Home", role: "PUBLIC" },
    { href: "/about", label: "About", role: "PUBLIC" },
    { href: "/contact", label: "Contact", role: "PUBLIC" },
  ];

  let dashboardLink = null;

  if (userData?.data?.role === role.admin) {
    dashboardLink = { href: "/admin", label: "Dashboard" };
  } else if (userData?.data?.role === role.user) {
    dashboardLink = { href: "/user", label: "Dashboard" };
  } else if (userData?.data?.role === role.super_admin) {
    dashboardLink = { href: "/super_admin", label: "Dashboard" };
  } else if (userData?.data?.role === role.guide) {
    dashboardLink = { href: "/guide", label: "Dashboard" };
  }

  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    const toastId = toast.loading("logging out....");
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
    <header className="font-montserrat bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logo} className="w-20 h-20 drop-shadow-md" alt="logo" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-x-4">
            {navLinks.map((link, index) => (
              <NavLink
                key={link.label + link.href}
                to={link.href}
                end={link.href === "/"}
                className={({ isActive }) =>
                  `relative text-sm font-medium transition-all duration-300 group transform ${
                    isActive
                      ? "text-purple-600 dark:text-purple-500"
                      : "text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                  }`
                }
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <span className="relative z-10 rounded-lg transition-all duration-300">
                  {link.label}
                </span>
                <span className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-purple-600 w-0 group-hover:w-full transition-all duration-500 ease-out rounded-full" />
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="transform transition-all duration-300 hover:scale-105">
              <AnimatedThemeToggler />
            </div>{" "}
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer" asChild>
                {userData?.data?.picture ? (
                  <img
                    className="w-10 h-10 rounded-full"
                    src={userData?.data?.picture}
                    alt=""
                  />
                ) : (
                  <CircleUserRound />
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 mr-10 font-serif"
                align="start"
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                {userData && (
                  <>
                    <DropdownMenuItem>{userData?.data?.name}</DropdownMenuItem>
                    <DropdownMenuItem>{userData?.data?.email}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuGroup>
                  {dashboardLink && (
                    <DropdownMenuItem className="cursor-pointer" asChild>
                      <Link to={dashboardLink.href}>{dashboardLink.label}</Link>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                {userData && userData?.data?.email ? (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="hidden md:block w-full">
                      Login
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="cursor-pointer inline-flex items-center justify-center p-2 rounded text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500 dark:focus:ring-gray-400 transition-all duration-300 transform border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <div className="relative">
                  <X
                    className={`h-6 w-6 absolute transition-all duration-300 transform ${
                      isMenuOpen
                        ? "opacity-100 rotate-0"
                        : "opacity-0 rotate-90"
                    }`}
                  />
                  <AlignJustify
                    className={`h-6 w-6 transition-all duration-300 transform ${
                      isMenuOpen
                        ? "opacity-0 -rotate-90"
                        : "opacity-100 rotate-0"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown with enhanced animations */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 z-40 border-t border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-black/95 backdrop-blur-md transition-all duration-300 ease-out transform origin-top shadow-lg ${
          isMenuOpen
            ? "opacity-100 scale-y-100 translate-y-0"
            : "opacity-0 scale-y-0 -translate-y-2 pointer-events-none"
        }`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-2 sm:px-3 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-gray-900/50">
          {navLinks.map((link, index) => (
            <NavLink
              key={link.label + link.href}
              to={link.href}
              end={link.href === "/"}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 transform hover:scale-[1.02] hover:translate-x-2 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 ${
                  isActive
                    ? "text-purple-500 dark:text-purple-500 bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800 shadow-sm"
                    : "text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:shadow-md"
                }`
              }
              style={{
                animationDelay: `${index * 0.05}s`,
                transform: isMenuOpen ? "translateX(0)" : "translateX(-20px)",
                opacity: isMenuOpen ? 1 : 0,
                transition: `all 0.3s ease-out ${index * 0.05}s`,
              }}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50"></div>
                {link.label}
              </div>
            </NavLink>
          ))}
          <div
            className="pt-2 border-t border-gray-200 dark:border-gray-700 mt-4"
            style={{
              animationDelay: `${navLinks.length * 0.05}s`,
              transform: isMenuOpen ? "translateY(0)" : "translateY(20px)",
              opacity: isMenuOpen ? 1 : 0,
              transition: `all 0.3s ease-out ${navLinks.length * 0.05}s`,
            }}
          >
            {userData && userData.data.email ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg rounded-xl border-2 hover:border-gray-400 dark:hover:border-gray-500"
              >
                Logout
              </Button>
            ) : (
              <Link
                to="/login"
                className="w-full mt-2 text-center items-center justify-center rounded-xl text-sm font-medium h-12 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 block transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg border-2 border-transparent hover:border-gray-700 dark:hover:border-gray-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
