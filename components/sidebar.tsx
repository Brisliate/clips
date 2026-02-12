"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserRole } from "@prisma/client";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Wallet,
  Settings,
  BarChart3,
  FileVideo,
  PlusCircle,
  Shield,
} from "lucide-react";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Campaigns",
    href: "/brand/campaigns",
    icon: Briefcase,
    roles: ["BRAND", "ADMIN"],
  },
  {
    title: "Create Campaign",
    href: "/brand/campaigns/new",
    icon: PlusCircle,
    roles: ["BRAND"],
  },
  {
    title: "Browse Campaigns",
    href: "/creator/campaigns",
    icon: FileVideo,
    roles: ["CREATOR"],
  },
  {
    title: "My Submissions",
    href: "/creator/submissions",
    icon: FileVideo,
    roles: ["CREATOR"],
  },
  {
    title: "Wallet",
    href: "/wallet",
    icon: Wallet,
    roles: ["CREATOR", "BRAND"],
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    title: "Admin Panel",
    href: "/admin",
    icon: Shield,
    roles: ["ADMIN"],
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  userRole: UserRole;
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  const filteredItems = sidebarItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  );

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold">ClipMarket</h2>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
