import {
  Briefcase,
  Bookmark,
  FileText,
  FileUser,
  LayoutDashboard,
  Mail,
  Settings,
  User,
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
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
