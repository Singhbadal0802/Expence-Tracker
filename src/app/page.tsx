"use client"
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import DashboardCards from "@/components/MFA/DashBoardCards";

export default function Home() {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex flex-row w-full h-max justify-between items-center mb-8">
        <div data-testid="greting-section" className="flex">
          <div className="flex flex-col">
            <h2 className="text-heading2 lg:text-heading1 font-bold">Dashboard</h2>
            <p className="hidden md:block text-gray-600 text-body1 font-regular">
              Welcome back, Badal👋
            </p>
          </div>
        </div>
        <div className="flex flex-row gap-6 justify-end items-center">
          <input type="month" name="selectedMonthRange" defaultValue={currentMonth} max={currentMonth} onChange={(e)=> setSelectedMonth(e.target.value)} className="hidden md:flex flex-row gap-4 border border-2 border-gray-300 px-4 py-2 rounded-xl text-gray-600 text-body1 font-regular bg-surface"/>
          {/* <div className="flex flex-row gap-4 border border-2 border-gray-300 px-4 py-2 rounded-xl text-gray-600 text-body1 font-regular">01 Aug - 31 Aug 2026 <CalendarDays /></div> */}
          <div className="relative">
            <a href="/notifications"><Bell className="rounded-full border border-3 border-gray-300 p-2 w-10 h-10" /></a>
            <span className="absolute top-2 right-2 bg-red-600/80 w-2 h-2 rounded-full" />
          </div>
          <img
            src="/assests/favicon.png"
            className="w-10 h-10 p-1 bg-primary rounded-full"
          />
        </div>
      </div>
        <DashboardCards selectedMonth={selectedMonth} />
    </main>
  );
}
