import { Moon, SunDim } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export const AnimatedThemeToggler = ({ className }: Props) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedTheme = localStorage.getItem("theme");
    const shouldUseDark = savedTheme === "dark";

    setIsDarkMode(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) return;

    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode, isHydrated]);

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const changeTheme = async () => {
    if (!buttonRef.current) return;

    if (!document.startViewTransition) {
      setIsDarkMode((prev) => !prev);
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        setIsDarkMode((prev) => !prev);
      });
    }).ready;

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const y = top + height / 2;
    const x = left + width / 2;

    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRad}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };
  return (
    <button
      ref={buttonRef}
      onClick={changeTheme}
      className={`${cn(className)} cursor-pointer`}
    >
      {isDarkMode ? <SunDim /> : <Moon />}
    </button>
  );
};
