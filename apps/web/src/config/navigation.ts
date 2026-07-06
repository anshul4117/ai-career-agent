import {
  Briefcase,
  Bookmark,
  FileText,
  FileUser,
  LayoutDashboard,
  Mail,
  Settings,
  User,
  Bell,
  Building2
} from "lucide-react";
import type { NavItem } from "@/types";

export const mainNavigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Resume",
    href: "/resume",
    icon: FileUser,
  },
  {
    title: "Jobs",
    href: "/jobs",
    icon: Briefcase,
  },
  {
    title: "Companies",
    href: "/companies",
    icon: Building2,
  },
  {
    title: "Saved Jobs",
    href: "/saved-jobs",
    icon: Bookmark,
  },
  {
    title: "Applications",
    href: "/applications",
    icon: FileText,
  },
  {
    title: "Cover Letters",
    href: "/cover-letters",
    icon: Mail,
  },
  {
    title: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
