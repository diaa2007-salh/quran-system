"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  UserRound,
  ClipboardCheck,
  Settings,
  BookOpenText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/shared/LogoutButton";

const NAV_ITEMS = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard },
  { href: "/admin/teachers", label: "المعلمون", icon: GraduationCap },
  { href: "/admin/groups", label: "الأفواج", icon: Users },
  { href: "/admin/students", label: "التلاميذ", icon: UserRound },
  { href: "/admin/reports", label: "تقارير الحضور", icon: ClipboardCheck },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
] as const;

export function AdminSidebar({
  userName,
  schoolName,
}: {
  userName: string;
  schoolName: string;
}) {
  const pathname = usePathname();

  return (
    <aside className="pattern-geometric flex h-full w-64 flex-col justify-between p-4">
      <div>
        <div className="mb-8 flex items-center gap-2.5 px-2 pt-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
            <BookOpenText className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-display text-sm font-bold text-white">{schoolName}</p>
            <p className="text-xs text-white/60">لوحة الإدارة</p>
          </div>
        </div>

        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white text-primary-dark"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="space-y-2 border-t border-white/10 pt-4">
        <p className="truncate px-3 text-xs text-white/50">{userName}</p>
        <LogoutButton />
      </div>
    </aside>
  );
}
