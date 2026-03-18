"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Rocket } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
  authNode: React.ReactNode;
};

const links = [
  { href: "/", label: "Chat" },
  { href: "/ideas", label: "Ideas" },
  { href: "/reports", label: "Reports" },
];

export function AppShell({ children, authNode }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_40%),linear-gradient(140deg,#091f2f_0%,#103b56_40%,#d6a347_100%)] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#082135]/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-wide">
            <span className="rounded-lg bg-amber-300/20 p-2 text-amber-200">
              <Rocket className="size-4" />
            </span>
            Founderz
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors hover:bg-white/10",
                  pathname === link.href ? "bg-white/15" : "text-white/80"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">{authNode}</div>

          <Sheet>
            <SheetTrigger
              render={<Button size="icon" variant="ghost" className="md:hidden" />}
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="right" className="border-white/10 bg-[#0f2d44] text-white">
              <SheetHeader>
                <SheetTitle className="text-white">Founderz</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-white/10",
                      pathname === link.href ? "bg-white/15" : "text-white/80"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="mt-6">{authNode}</div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
