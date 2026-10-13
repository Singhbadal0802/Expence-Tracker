"use client";
import React, { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Menu, Bell, ArrowLeft, LogOut } from "lucide-react";
import LogoutModal from "../LogoutModal";
import { MenuOptions } from "./utility/index";

const emptySubscribe = () => () => {};
const HIDE_MENU_OPTIONS = ["/login", "/register", "login", "register"];
const optionsToShowTitleInNav = ["Add Transaction"];

const MenuBar = () => {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const pathname = usePathname();

  const isOnLoginPage = pathname.includes("login") || pathname.includes("register");
  const currentPage = MenuOptions.find((element) => element.menuUrl === pathname);
  const isBackButtonVisible = optionsToShowTitleInNav.includes(
    currentPage?.menuLabel ?? "",
  );

  if (HIDE_MENU_OPTIONS.includes(pathname)) return null;

  return (
    <>
      {!isOnLoginPage && <LogoutModal />}
      <nav className="flex flex-1 min-w-68 max-w-72 flex-col gap-md border-r-4 border-gray-200 hidden lg:flex p-4 shadow-lg transition-all duration-400 overflow-y-auto">
        <div className="flex group text-center font-bold text-heading3 gap-4 items-center py-4">
          <img
            src="/assests/favicon.png"
            alt="Expence Tracker"
            className="w-12 h-12 p-1 bg-primary rounded-lg"
          />
          Expence Tracker
        </div>
        {MenuOptions.map((navlink) => {
          const Icon = navlink.icon;
          const isActive = pathname === navlink.menuUrl;

          return (
            <a
              key={navlink.menuLabel}
              className={`group flex cursor-pointer items-center gap-3 rounded-xl px-4 py-2 mr-4 text-heading3 font-medium transition-all duration-100 ease-in-out ${
                isActive
                  ? "bg-primary/20 text-primary font-bold"
                  : "text-gray-600 hover:bg-primary/20 hover:font-bold hover:text-primary"
              }`}
              href={navlink.menuUrl}
              target="_self"
              onClick={() => {
                sessionStorage.setItem("isOnPage", navlink.menuLabel);
              }}
            >
              <Icon
                className={`h-5 w-5 ${
                  isActive
                    ? "text-primary font-bold"
                    : "text-gray-500 group-hover:text-primary group-hover:font-bold"
                }`}
              />
              <span>{navlink.menuLabel}</span>
            </a>
          );
        })}
        <button
          className="group flex cursor-pointer items-center gap-3 rounded-xl px-4 py-2 mr-4 text-heading3 font-medium text-gray-600 hover:bg-primary/20 hover:font-bold transition-all duration-100 ease-in-out hover:text-primary"
          onClick={() => {
            sessionStorage.clear();
            window.location.href = "/login";
          }}
        >
          <LogOut className="h-5 w-5 text-gray-500 group-hover:text-primary group-hover:font-bold" />
          <span>Logout</span>
        </button>
      </nav>

      {isMounted ? (
        <div className="flex lg:hidden gap-4 m-4 mb-2 p-2 px-4 transition-all duration-400">
          <button
            className="flex items-center h-8 my-auto"
            onClick={() => {
              if (isBackButtonVisible) {
                window.location.href = "/";
              } else {
                window.location.reload();
              }
            }}
          >
            {isBackButtonVisible ? <ArrowLeft /> : <Menu />}
          </button>
          <div className="flex flex-1 justify-between items-center mx-auto font-semibold text-heading2">
            {currentPage?.menuLabel}{" "}
            {!isBackButtonVisible && (
              <div className="relative">
                <a href="/notifications">
                  <Bell className="rounded-full border border-3 border-gray-300 p-2 w-10 h-10 bg-background" />
                </a>
                <span className="absolute top-2 right-2 bg-red-600/80 w-2 h-2 rounded-full" />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex lg:hidden gap-4 m-4 mb-2 p-2 px-4 h-14 transition-all duration-400 animate-pulse bg-gray-300"></div>
      )}
    </>
  );
};

export default MenuBar;
