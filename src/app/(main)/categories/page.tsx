"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Utensils,
  Car,
  ShoppingBag,
  Film,
  HeartPulse,
  GraduationCap,
  FileText,
  Tag,
  PieChart,
} from "lucide-react";
import { getStoredUserData, DATA_CHANGED_EVENT } from "@/utilities/dataService";
import { ExpenseTrackerResponse } from "@/components/MFA/DashBoardCards/interface";

const categoryIcons: Record<string, React.ElementType> = {
  Food: Utensils,
  "Food & Dining": Utensils,
  Transport: Car,
  Transportation: Car,
  Shopping: ShoppingBag,
  Entertainment: Film,
  Health: HeartPulse,
  Education: GraduationCap,
  Bills: FileText,
  Utilities: FileText,
  Other: Tag,
  Miscellaneous: Tag,
};

const categoryColors: Record<string, string> = {
  Food: "bg-orange-500",
  "Food & Dining": "bg-orange-500",
  Transport: "bg-blue-500",
  Transportation: "bg-blue-500",
  Shopping: "bg-purple-500",
  Entertainment: "bg-pink-500",
  Health: "bg-emerald-500",
  Education: "bg-indigo-500",
  Bills: "bg-amber-500",
  Utilities: "bg-amber-500",
  Other: "bg-gray-500",
  Miscellaneous: "bg-gray-500",
};

export default function CategoriesPage() {
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

  const categoryStats = useMemo(() => {
    if (!userData?.expenses) return [];

    const stats: Record<
      string,
      { total: number; count: number; recentDate: string }
    > = {};

    let grandTotal = 0;

    userData.expenses.forEach((e) => {
      const cat = e.category || "Other";
      if (!stats[cat]) {
        stats[cat] = { total: 0, count: 0, recentDate: e.date };
      }
      stats[cat].total += e.amount;
      stats[cat].count += 1;
      grandTotal += e.amount;
      if (e.date > stats[cat].recentDate) {
        stats[cat].recentDate = e.date;
      }
    });

    return Object.entries(stats)
      .map(([name, data]) => ({
        name,
        total: data.total,
        count: data.count,
        percentage: grandTotal > 0 ? (data.total / grandTotal) * 100 : 0,
        average: data.count > 0 ? data.total / data.count : 0,
        recentDate: data.recentDate,
      }))
      .sort((a, b) => b.total - a.total);
  }, [userData]);

  const totalExpense = useMemo(() => {
    return categoryStats.reduce((sum, c) => sum + c.total, 0);
  }, [categoryStats]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 bg-transparent max-w-7xl w-full mx-auto">
      <div>
        <h1 className="text-heading2 lg:text-heading1 font-bold">Categories</h1>
        <p className="text-gray-600 text-body1">
          Explore and analyze your spending across different categories
        </p>
      </div>

      {/* Overview Card */}
      <div className="bg-background rounded-xl p-6 border border-2 border-gray-200 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary/15 text-primary rounded-2xl">
            <PieChart className="w-8 h-8" />
          </div>
          <div>
            <span className="text-caption text-gray-500 font-medium">
              Total Tracked Expenses
            </span>
            <p className="text-heading1 font-bold text-foreground">
              ₹{totalExpense.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="text-right">
            <span className="text-caption text-gray-500 font-medium">Categories</span>
            <p className="text-heading2 font-bold">{categoryStats.length}</p>
          </div>
          <div className="text-right">
            <span className="text-caption text-gray-500 font-medium">
              Avg per Category
            </span>
            <p className="text-heading2 font-bold text-primary">
              ₹
              {categoryStats.length > 0
                ? (totalExpense / categoryStats.length).toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })
                : 0}
            </p>
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryStats.map((cat) => {
          const Icon = categoryIcons[cat.name] || Tag;
          const colorClass = categoryColors[cat.name] || "bg-primary";

          return (
            <div
              key={cat.name}
              className="bg-background rounded-xl p-5 border border-2 border-gray-200 shadow-md hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-opposite ${colorClass}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-heading3">{cat.name}</h3>
                      <span className="text-caption text-gray-400">
                        {cat.count} transactions
                      </span>
                    </div>
                  </div>
                  <span className="text-caption font-bold px-2.5 py-1 bg-gray-100 rounded-full text-gray-700">
                    {cat.percentage.toFixed(1)}%
                  </span>
                </div>

                <div className="space-y-1 mb-4">
                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full ${colorClass}`}
                      style={{ width: `${Math.min(100, cat.percentage)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div>
                  <span className="text-[11px] text-gray-400 uppercase font-semibold">
                    Avg Transaction
                  </span>
                  <p className="text-body2 font-semibold">
                    ₹{cat.average.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-gray-400 uppercase font-semibold">
                    Total Spent
                  </span>
                  <p className="text-heading3 font-bold text-danger">
                    ₹{cat.total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
