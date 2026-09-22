import {
  LayoutDashboard,
  List,
  LayoutFreeform,
  ChartPie,
  ChartNoAxesCombined,
  Target,
  Bell,
  Settings,
  CircleUser,
  CircleHelp,
  LogOut,
  PlusCircle,
} from "lucide-react";

export const MenuOptions = [
  {
    icon: LayoutDashboard,
    menuLabel: "Dashboard",
    menuUrl: "/",
  },
  {
    icon: List,
    menuLabel: "Transactions",
    menuUrl: "/transactions",
  },
  {
    icon: PlusCircle,
    menuLabel: "Add Transaction",
    menuUrl: "/entries",
  },
  {
    icon: LayoutFreeform,
    menuLabel: "Categories",
    menuUrl: "/categories",
  },
  {
    icon: ChartPie,
    menuLabel: "Budgets",
    menuUrl: "/budgets",
  },
  {
    icon: ChartNoAxesCombined,
    menuLabel: "Reports",
    menuUrl: "/reports",
  },
  {
    icon: Target,
    menuLabel: "Goals",
    menuUrl: "/goals",
  },
  {
    icon: Bell,
    menuLabel: "Notifications",
    menuUrl: "/notifications",
  },
  {
    icon: Settings,
    menuLabel: "Settings",
    menuUrl: "/settings",
  },
  {
    icon: CircleUser,
    menuLabel: "Profile",
    menuUrl: "/profile",
  },
  {
    icon: CircleHelp,
    menuLabel: "Help & Support",
    menuUrl: "/help",
  },
  {
    icon: LogOut,
    menuLabel: "Logout",
    menuUrl: "/logout",
  },
];
