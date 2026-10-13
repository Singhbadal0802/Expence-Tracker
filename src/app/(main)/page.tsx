"use client";
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import DashboardCards from "@/components/MFA/DashBoardCards";
import {
  getStoredUserData,
  getStoredUserDetails,
  DATA_CHANGED_EVENT,
} from "@/utilities/dataService";
import { User, ExpenseTrackerResponse } from "@/components/MFA/DashBoardCards/interface";

export default function Home() {
  const [userData, setUserData] = useState<ExpenseTrackerResponse | null>(() => {
    return getStoredUserData();
  });
  const [userDetails, setUserDetails] = useState<User | null>(() => {
    return getStoredUserDetails();
  });
  const [userInitials, setUserInitials] = useState<string>(() => {
    const user = getStoredUserDetails();
    if (user?.name) {
      const parts = user.name.trim().split(/\s+/);
      return (
        parts.length > 1
          ? `${parts[0][0]}${parts[parts.length - 1][0]}`
          : (parts[0]?.slice(0, 2) || "ET")
      ).toUpperCase();
    }
    return "";
  });
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const data = getStoredUserData();
    if (data?.monthlySummary?.length) {
      return data.monthlySummary[data.monthlySummary.length - 1].month;
    }
    return new Date().toISOString().slice(0, 7);
  });

  useEffect(() => {

    const handleDataChange = () => {
      const updatedData = getStoredUserData();
      const updatedUser = getStoredUserDetails();
      setUserData(updatedData);
      setUserDetails(updatedUser);
      if (updatedUser?.name) {
        const parts = updatedUser.name.trim().split(/\s+/);
        const initials =
          parts.length > 1
            ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
            : (parts[0]?.slice(0, 2) || "ET").toUpperCase();
        setUserInitials(initials);
      }
    };

    window.addEventListener(DATA_CHANGED_EVENT, handleDataChange);
    return () => {
      window.removeEventListener(DATA_CHANGED_EVENT, handleDataChange);
    };
  }, []);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 bg-transparent">
      <div className="hidden lg:flex flex-row w-full h-max justify-between items-center mb-8">
        <div data-testid="greting-section" className="flex">
          <div className="flex flex-col">
            <h2 className="text-heading2 lg:text-heading1 font-bold">
              Dashboard
            </h2>
            <p className="hidden md:block text-gray-600 text-body1 font-regular">
              {userDetails?.name
                ? `Welcome back, ${userDetails.name} 👋`
                : "Join us to track yourself... 😊"}
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-6 justify-end items-center">
          <input
            type="month"
            name="selectedMonthRange"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="hidden md:flex flex-row gap-4 border border-2 border-gray-300 px-4 py-2 rounded-xl text-gray-600 text-body1 font-regular bg-surface"
          />
          <div className="relative hidden lg:block">
            <a href="/notifications" aria-label="Notifications">
              <Bell className="rounded-full border border-3 border-gray-300 p-2 w-10 h-10 hover:text-primary transition-colors" />
            </a>
            <span className="absolute top-2 right-2 bg-red-600/80 w-2 h-2 rounded-full" />
          </div>
          {userData?.user?.profileImageUrl ? (
            <a href="/profile" title="View Profile">
              <img
                src={userData.user.profileImageUrl}
                alt={userData.user.name || "User Avatar"}
                className="w-10 h-10 p-1 bg-primary rounded-full object-cover"
              />
            </a>
          ) : userInitials ? (
            <a href="/profile" title="View Profile">
              <div className="font-bold text-heading3 text-center flex items-center justify-center text-opposite w-10 h-10 bg-primary rounded-full">
                {userInitials}
              </div>
            </a>
          ) : null}
        </div>
      </div>
      <DashboardCards selectedMonth={selectedMonth} />
    </main>
  );
}
