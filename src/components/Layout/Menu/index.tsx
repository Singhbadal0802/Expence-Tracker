"use client"
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  WalletCards,
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
import data from '@/utilities/expenceData.json';
import LogoutModal from "../LogoutModal";

const MenuBar = () => {
  const [isOnLoginPage, setIsOnLoginPage] = useState<boolean>(false);
  const HIDE_MENU_OPTIONS = [
    "login",
    "register",
  ];
  const pathname = usePathname();
  if(HIDE_MENU_OPTIONS.includes(pathname)) return null;
  const MenuOptions = [
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
      menuUrl: "/new",
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

  useEffect(()=>{
    if(typeof window !== "undefined"){
      setIsOnLoginPage(window.location.href.includes('login'));
    }
  },[])

  useEffect(()=>{
    sessionStorage.setItem('userData', JSON.stringify(data));
  },[])

  return (
    <>
    {!isOnLoginPage && <LogoutModal/>}
    {!isOnLoginPage && <nav className="h-[95vh] min-w-68 max-w-72 flex-col gap-md border-r-4 border-gray-200 hidden md:flex  p-4">
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
    </nav>}
    </>
  );
};

export default MenuBar;
