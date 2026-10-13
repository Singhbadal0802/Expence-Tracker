"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ReceiptIndianRupee,
  BanknoteArrowUp,
  BanknoteArrowDown,
  PiggyBank,
  LucideIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
} from "lucide-react";
import GenericNumberCard from "@/components/UI/GenericNumberCard";
import {
  ExpenseTrackerResponse,
  DashboardCardsPorps,
} from "./interface";
import { getPerformanceComparison } from "./utils/utility";
import BarGraph from "@/components/UI/BarGraph";
import { getStoredUserData, DATA_CHANGED_EVENT } from "@/utilities/dataService";

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
  const [userData, setUserData] = useState<ExpenseTrackerResponse | null>(() => {
    return getStoredUserData();
  });
  const isLoading = false;

  // Subscribe to real-time data updates
  useEffect(() => {
    const handleUpdate = () => {
      setUserData(getStoredUserData());
    };

    window.addEventListener(DATA_CHANGED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(DATA_CHANGED_EVENT, handleUpdate);
    };
  }, []);

  const { selectedMonthData, lastMonthData } = useMemo(() => {
    if (!userData?.monthlySummary || userData.monthlySummary.length === 0) {
      return { selectedMonthData: null, lastMonthData: null };
    }

    const currentMonthIndex = userData.monthlySummary.findIndex(
      (entry) => entry.month.toString() === selectedMonth.toString(),
    );

    if (currentMonthIndex === -1) {
      // If selected month doesn't match, use the latest recorded month
      const latestIndex = userData.monthlySummary.length - 1;
      const prevIndex = latestIndex > 0 ? latestIndex - 1 : null;
      return {
        selectedMonthData: userData.monthlySummary[latestIndex] || null,
        lastMonthData: prevIndex !== null ? userData.monthlySummary[prevIndex] : null,
      };
    }

    const lastMonthIndex = currentMonthIndex > 0 ? currentMonthIndex - 1 : null;
    return {
      selectedMonthData: userData.monthlySummary[currentMonthIndex],
      lastMonthData:
        lastMonthIndex !== null ? userData.monthlySummary[lastMonthIndex] : null,
    };
  }, [selectedMonth, userData]);

  const genericCardArray: GenericCardData[] = useMemo(() => {
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
  }, [selectedMonthData, lastMonthData]);

  const recentTransactions = useMemo(() => {
    if (!userData) return [];
    const all: Array<{
      id: string;
      title: string;
      category: string;
      date: string;
      amount: number;
      type: "Expense" | "Income";
      mode?: string;
    }> = [];

    (userData.expenses || []).slice(0, 10).forEach((e) => {
      all.push({
        id: e.expenseId,
        title: e.merchant,
        category: e.category,
        date: e.date,
        amount: e.amount,
        type: "Expense",
        mode: e.paymentMode,
      });
    });

    (userData.income || []).slice(0, 10).forEach((i) => {
      all.push({
        id: i.incomeId,
        title: i.payer,
        category: i.source,
        date: i.date,
        amount: i.amount,
        type: "Income",
        mode: i.paymentMode,
      });
    });

    return all
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);
  }, [userData]);

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-0 md:px-4 my-4">
        {/* Monthly Trend Bar Chart */}
        <div className="flex flex-col rounded-xl border border-3 border-gray-200 min-w-[280px] shadow-lg transition-all duration-400 bg-background p-6">
          <BarGraph
            monthlyData={userData?.monthlySummary}
            title="Monthly Cash Flow"
          />
        </div>

        {/* Recent Transactions List */}
        <div className="flex flex-col rounded-xl border border-3 border-gray-200 min-w-[280px] shadow-lg transition-all duration-400 bg-background p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h3 className="text-heading3 font-semibold">Recent Transactions</h3>
            </div>
            <a
              href="/transactions"
              className="text-primary hover:underline text-body2 font-semibold"
            >
              View all →
            </a>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="flex items-center justify-center flex-1 py-12 text-gray-400">
              No transactions recorded yet
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-gray-100">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-3 hover:bg-gray-50/50 rounded-lg px-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        tx.type === "Income"
                          ? "bg-success/15 text-success"
                          : "bg-danger/15 text-danger"
                      }`}
                    >
                      {tx.type === "Income" ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-body1 text-foreground">
                        {tx.title}
                      </span>
                      <span className="text-caption text-gray-500">
                        {tx.category} • {tx.date}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-semibold text-body1 ${
                        tx.type === "Income" ? "text-success" : "text-danger"
                      }`}
                    >
                      {tx.type === "Income" ? "+" : "-"}₹
                      {tx.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    {tx.mode && (
                      <span className="block text-[11px] text-gray-400">
                        {tx.mode}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardCards;
