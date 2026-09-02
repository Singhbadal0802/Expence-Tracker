"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ReceiptIndianRupee,
  BanknoteArrowUp,
  BanknoteArrowDown,
  PiggyBank,
  LucideIcon,
} from "lucide-react";
import GenericNumberCard from "@/components/UI/GenericNumberCard";
import {
  ExpenseTrackerResponse,
  MonthlySummary,
  DashboardCardsPorps,
} from "./interface";
import { getPerformanceComparison } from "./utils/utility";
import BarGraph from "@/components/UI/BarGraph";

type CardTone = "primary" | "success" | "danger" | "warning";
type CardTrend = "Increase" | "Decrease";

interface GenericCardData {
  title: string;
  Ammount: number;
  tone: CardTone;
  performance: CardTrend;
  performanceAmmount: number;
  IconName: LucideIcon;
}

const buildCardMetric = (
  current: number | null | undefined,
  previous: number | null | undefined,
): { amount: number; performance: CardTrend; performanceAmount: number } => {
  const amount = current ?? 0;
  const performanceAmount = getPerformanceComparison(
    current ?? 0,
    previous ?? 0,
  );

  return {
    amount,
    performance: performanceAmount >= 0 ? "Increase" : "Decrease",
    performanceAmount,
  };
};

const DashboardCards = ({ selectedMonth }: DashboardCardsPorps) => {
  const [userData, setUserData] = useState<ExpenseTrackerResponse | null>(null);
  const [lastMonthData, setLastMonthData] = useState<MonthlySummary | null>(
    null,
  );
  const [selectedMonthData, setSelectedMonthData] =
    useState<MonthlySummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);

    const data = sessionStorage.getItem("userData");
    if (data) {
      setUserData(JSON.parse(data));
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (!selectedMonth || !userData?.monthlySummary) return;

    const currentMonthIndex = userData.monthlySummary.findIndex(
      (entry) => entry.month.toString() === selectedMonth.toString(),
    );

    if (currentMonthIndex === -1) {
      setSelectedMonthData(null);
      setLastMonthData(null);
      return;
    }

    const lastMonthIndex = currentMonthIndex > 0 ? currentMonthIndex - 1 : null;

    setSelectedMonthData(userData.monthlySummary[currentMonthIndex]);
    setLastMonthData(
      lastMonthIndex !== null ? userData.monthlySummary[lastMonthIndex] : null,
    );
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [selectedMonth, userData]);

  const genericCardArray: GenericCardData[] = useMemo(() => {
    // const budget = userData?.user?.monthlyBudget;
    const budget = selectedMonthData?.totalIncome;

    const currentBalance =
      budget != null && selectedMonthData?.totalSpent != null
        ? budget - selectedMonthData.totalSpent
        : null;
    const lastBalance =
      budget != null && lastMonthData?.totalSpent != null
        ? budget - lastMonthData.totalSpent
        : null;

    const currentSavings =
      selectedMonthData?.totalIncome != null &&
      selectedMonthData?.totalSpent != null
        ? selectedMonthData.totalIncome - selectedMonthData.totalSpent
        : null;
    const lastSavings =
      lastMonthData?.totalIncome != null && lastMonthData?.totalSpent != null
        ? lastMonthData.totalIncome - lastMonthData.totalSpent
        : null;

    const balance = buildCardMetric(currentBalance, lastBalance);
    const income = buildCardMetric(
      selectedMonthData?.totalIncome,
      lastMonthData?.totalIncome,
    );
    const expenses = buildCardMetric(
      selectedMonthData?.totalSpent,
      lastMonthData?.totalSpent,
    );
    const savings = buildCardMetric(currentSavings, lastSavings);

    return [
      {
        title: "Total Balance",
        Ammount: balance.amount,
        tone: "primary",
        performance: balance.performance,
        performanceAmmount: balance.performanceAmount,
        IconName: ReceiptIndianRupee,
      },
      {
        title: "Total Income",
        Ammount: income.amount,
        tone: "success",
        performance: income.performance,
        performanceAmmount: income.performanceAmount,
        IconName: BanknoteArrowUp,
      },
      {
        title: "Total Expenses",
        Ammount: expenses.amount,
        tone: "danger",
        performance: expenses.performance,
        performanceAmmount: expenses.performanceAmount,
        IconName: BanknoteArrowDown,
      },
      {
        title: "Savings",
        Ammount: savings.amount,
        tone: "warning",
        performance: savings.performance,
        performanceAmmount: savings.performanceAmount,
        IconName: PiggyBank,
      },
    ];
  }, [userData, selectedMonthData, lastMonthData]);

  return (
    <>
    <div className="flex flex-row flex-wrap justify-between">
      {genericCardArray.map((card) => (
        <GenericNumberCard
          key={`Expense-tracker-${card.title}`}
          {...card}
          isLoading={isLoading}
        />
      ))}
    </div>
    <div className="flex flex-col md:flex-row gap-8 px-4">
      <div className="flex flex-1 flex-col rounded-xl border border-3 border-gray-200 min-w-[200px] shadow-lg transition-all duration-400 w-full lg:w-[50%] p-4"><BarGraph/></div>
      <div className="flex flex-1 flex-col rounded-xl border border-3 border-gray-200 min-w-[200px] shadow-lg transition-all duration-400 w-full lg:w-[50%] h-20 p-4"></div>
      </div>
      </>
  );
};

export default DashboardCards;
