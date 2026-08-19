import React from "react";
import {
  LayoutDashboard,
  WalletCards,
  ArrowLeftRight,
  Tags,
  ChartPie,
  ChartNoAxesCombined,
  Target,
  RefreshCw,
  Bell,
  Settings,
  CircleUser,
  CircleHelp,
  LogOut,
} from "lucide-react";

const MenuBar = () => {
  const MenuOptions = [
    {
      icon: LayoutDashboard,
      menuLabel: "Dashboard",
      menuUrl: "/",
    },
    {
      icon: WalletCards,
      menuLabel: "Accounts",
      menuUrl: "/accounts",
    },
    {
      icon: ArrowLeftRight,
      menuLabel: "Transactions",
      menuUrl: "/transactions",
    },
    {
      icon: Tags,
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
    // {
    //   icon: RefreshCw,
    //   menuLabel: "Recurring Transactions",
    //   menuUrl: "/recurring",
    // },
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
  return (
    <nav className="h-[95vh] min-w-68 max-w-72 flex-col gap-md border-r-4 border-gray-200 hidden md:flex">
        <div className="flex group text-center font-bold text-heading3 gap-4 items-center py-4"><img src="/assests/favicon.png" className="w-12 h-12 p-1 bg-primary rounded-lg"/>Expence Tracker</div>
      {MenuOptions.map((navlink) => {
        const Icon = navlink.icon;

        return (
          <a
            key={navlink.menuLabel}
            className="group flex cursor-pointer items-center gap-3 rounded-xl px-4 py-2 mr-4 text-heading3 font-medium text-gray-600 hover:bg-primary/20 hover:font-bold transition-all duration-100 ease-in-out hover:text-primary"
            href={navlink.menuUrl}
            target="_self"
          >
            <Icon className="h-5 w-5 text-gray-500 group-hover:text-primary group-hover:font-bold " />
            <span>{navlink.menuLabel}</span>
          </a>
        );
      })}
    </nav>
  );
};

export default MenuBar;
