"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Award,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import Button from "@/components/UI/Button";
import { getStoredUserData, DATA_CHANGED_EVENT } from "@/utilities/dataService";
import { ExpenseTrackerResponse } from "@/components/MFA/DashBoardCards/interface";

export default function ReportsPage() {
  const [userData, setUserData] = useState<ExpenseTrackerResponse | null>(() => {
    return getStoredUserData();
  });

  useEffect(() => {
    const handleUpdate = () => {
      setUserData(getStoredUserData());
    };

    window.addEventListener(DATA_CHANGED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(DATA_CHANGED_EVENT, handleUpdate);
    };
  }, []);

  const summary = userData?.summary;
  const monthlyList = useMemo(() => {
    if (!userData?.monthlySummary) return [];
    return [...userData.monthlySummary].reverse();
  }, [userData]);

  const savingsRate = useMemo(() => {
    if (!summary || summary.totalIncomeLast12Months <= 0) return 0;
    return (summary.netSavingsLast12Months / summary.totalIncomeLast12Months) * 100;
  }, [summary]);

  const handleExportCSV = () => {
    if (!monthlyList.length) return;
    const headers = "Month,Total Income,Total Spent,Net Savings,Transaction Count\n";
    const rows = monthlyList
      .map(
        (m) =>
          `${m.month},${m.totalIncome},${m.totalSpent},${m.netSavings},${m.transactionCount}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ExpenseReport_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 bg-transparent max-w-7xl w-full mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-heading2 lg:text-heading1 font-bold">Financial Reports</h1>
          <p className="text-gray-600 text-body1">
            In-depth analysis of your financial performance and annual trends
          </p>
        </div>
        <Button
          buttonLabel="Export CSV"
          variant="brand-secondary"
          tone="primary"
          onClick={handleExportCSV}
          customClass="font-semibold flex items-center gap-2"
        />
      </div>

      {/* 12-Month Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl p-5 border border-2 border-gray-200 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-caption text-gray-500 font-semibold uppercase">
              12-Month Income
            </span>
            <div className="p-2 bg-success/15 text-success rounded-lg">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <p className="text-heading2 font-bold text-success">
            ₹{summary?.totalIncomeLast12Months?.toLocaleString("en-IN") || "0"}
          </p>
          <span className="text-caption text-gray-400">
            Avg ₹{summary?.averageMonthlyIncome?.toLocaleString("en-IN")}/mo
          </span>
        </div>

        <div className="bg-background rounded-xl p-5 border border-2 border-gray-200 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-caption text-gray-500 font-semibold uppercase">
              12-Month Spending
            </span>
            <div className="p-2 bg-danger/15 text-danger rounded-lg">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-heading2 font-bold text-danger">
            ₹{summary?.totalSpentLast12Months?.toLocaleString("en-IN") || "0"}
          </p>
          <span className="text-caption text-gray-400">
            Avg ₹{summary?.averageMonthlySpend?.toLocaleString("en-IN")}/mo
          </span>
        </div>

        <div className="bg-background rounded-xl p-5 border border-2 border-gray-200 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-caption text-gray-500 font-semibold uppercase">
              Net Savings
            </span>
            <div className="p-2 bg-primary/15 text-primary rounded-lg">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p
            className={`text-heading2 font-bold ${
              (summary?.netSavingsLast12Months || 0) >= 0 ? "text-primary" : "text-danger"
            }`}
          >
            ₹{summary?.netSavingsLast12Months?.toLocaleString("en-IN") || "0"}
          </p>
          <span className="text-caption text-gray-400">
            Savings Rate: {savingsRate.toFixed(1)}%
          </span>
        </div>

        <div className="bg-background rounded-xl p-5 border border-2 border-gray-200 shadow-md">
          <div className="flex justify-between items-center mb-2">
            <span className="text-caption text-gray-500 font-semibold uppercase">
              Peak Income Month
            </span>
            <div className="p-2 bg-warning/15 text-warning rounded-lg">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-heading2 font-bold text-foreground">
            {summary?.highestIncomeMonth || "N/A"}
          </p>
          <span className="text-caption text-gray-400">
            Peak Spend: {summary?.highestSpendingMonth || "N/A"}
          </span>
        </div>
      </div>

      {/* Monthly Breakdown History Table */}
      <div className="bg-background rounded-xl border border-2 border-gray-200 shadow-lg overflow-hidden">
        <div className="p-4 bg-surface border-b border-gray-200">
          <h2 className="text-heading3 font-bold">Monthly Performance History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-body1">
            <thead className="bg-gray-100 text-gray-600 font-semibold text-caption uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4">Income</th>
                <th className="py-3 px-4">Expenses</th>
                <th className="py-3 px-4">Net Savings</th>
                <th className="py-3 px-4">Transactions</th>
                <th className="py-3 px-4">Savings Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {monthlyList.map((m) => {
                const rate = m.totalIncome > 0 ? (m.netSavings / m.totalIncome) * 100 : 0;
                return (
                  <tr key={m.month} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-semibold text-foreground">
                      {m.month}
                    </td>
                    <td className="py-3 px-4 font-medium text-success">
                      +₹{m.totalIncome.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 font-medium text-danger">
                      -₹{m.totalSpent.toLocaleString("en-IN")}
                    </td>
                    <td
                      className={`py-3 px-4 font-semibold ${
                        m.netSavings >= 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      {m.netSavings >= 0 ? "+" : "-"}₹
                      {Math.abs(m.netSavings).toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {m.transactionCount} entries
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-caption font-bold ${
                          rate >= 10
                            ? "bg-success/15 text-success"
                            : rate > 0
                            ? "bg-warning/15 text-warning"
                            : "bg-danger/15 text-danger"
                        }`}
                      >
                        {rate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
