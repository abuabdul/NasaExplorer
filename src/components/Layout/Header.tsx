"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Rocket,
  Search,
  SatelliteDish,
  Flame,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const routes = [
  { href: "/", label: "Home", icon: Rocket },
  { href: "/mars", label: "Mars Mission", icon: SatelliteDish },
  { href: "/search", label: "Image Vault", icon: Search },
];

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const toggleDark = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="w-full bg-white/20 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 shadow-md transition-colors z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-bold">
          <Flame className="text-red-500" size={22} />
          Space Pirate
        </div>

        <div className="sm:hidden flex items-center gap-2">
          <button
            onClick={toggleDark}
            className="p-2 rounded hover:bg-zinc-200/50 dark:hover:bg-zinc-700/30"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            onClick={toggleMenu}
            className="p-2 rounded hover:bg-zinc-200/50 dark:hover:bg-zinc-700/30"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="hidden sm:flex gap-3 items-center">
          {routes.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}>
              <Button
                variant="ghost"
                className={cn(
                  "gap-1 text-sm text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white",
                  pathname === href && "text-red-500 dark:text-red-400 font-semibold"
                )}
              >
                <Icon size={16} />
                {label}
              </Button>
            </Link>
          ))}
          <button
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="p-2 rounded hover:bg-zinc-200/50 dark:hover:bg-zinc-700/30"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>
      </div>

      {menuOpen && (
        <nav className="sm:hidden px-4 pb-4 flex flex-col gap-2 bg-white dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 border-t border-zinc-200 dark:border-zinc-800">
          {routes.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 text-sm text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white",
                  pathname === href && "text-red-500 dark:text-red-400 font-semibold"
                )}
              >
                <Icon size={16} />
                {label}
              </Button>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
