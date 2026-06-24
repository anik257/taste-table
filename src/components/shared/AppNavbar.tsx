import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Moon, Search, Sun, ChevronRight } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/hooks/use-theme";
import { NAV_ITEMS } from "@/constants";

function Breadcrumbs() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = NAV_ITEMS.find((n) => pathname === n.url || pathname.startsWith(n.url + "/"));
  return (
    <nav className="hidden items-center gap-1.5 text-sm text-muted-foreground md:flex">
      <Link to="/dashboard" className="hover:text-foreground">Home</Link>
      <ChevronRight className="h-3.5 w-3.5" />
      <span className="font-medium text-foreground">{current?.title ?? "Page"}</span>
    </nav>
  );
}

export function AppNavbar() {
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-3 backdrop-blur-md md:px-6">
      <SidebarTrigger className="-ml-1" />
      <div className="hidden h-6 w-px bg-border md:block" />
      <Breadcrumbs />

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search orders, menu, staff…" className="h-9 w-64 pl-9 lg:w-80" />
        </div>

        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              <Badge variant="secondary">3 new</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {[
              { t: "New order from Table 7", s: "2 min ago" },
              { t: "Payment received: INV-2025014", s: "12 min ago" },
              { t: "Low stock: Atlantic salmon", s: "1 hr ago" },
            ].map((n) => (
              <DropdownMenuItem key={n.t} className="flex-col items-start gap-0.5 py-2.5">
                <p className="text-sm font-medium">{n.t}</p>
                <p className="text-xs text-muted-foreground">{n.s}</p>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src="https://i.pravatar.cc/100?u=owner" />
                <AvatarFallback>OB</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium md:inline">Olivia</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/settings">Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/settings">Settings</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/login">Sign out</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
