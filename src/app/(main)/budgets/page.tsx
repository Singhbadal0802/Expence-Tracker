"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  TrendingDown,
  Edit2,
  Check,
  X,
  Target,
} from "lucide-react";
import {
  getStoredUserData,
  updateUserProfile,
  DATA_CHANGED_EVENT,
} from "@/utilities/dataService";
import { ExpenseTrackerResponse } from "@/components/MFA/DashBoardCards/interface";

export default function BudgetsPage() {
  const [userData, setUserData] = useState<ExpenseTrackerResponse | null>(() => {
    return getStoredUserData();
  });
  const [isEditingBudget, setIsEditingBudget] = useState<boolean>(false);
  const [newBudgetVal, setNewBudgetVal] = useState<string>(() => {
    const data = getStoredUserData();
    return String(data?.user?.monthlyBudget || 45000);
  });

  useEffect(() => {
    const handleUpdate = () => {
      const updated = getStoredUserData();
      setUserData(updated);
    };

    window.addEventListener(DATA_CHANGED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(DATA_CHANGED_EVENT, handleUpdate);
    };
  }, []);

  const latestMonthly = useMemo(() => {
    if (!userData?.monthlySummary?.length) return null;
    return userData.monthlySummary[userData.monthlySummary.length - 1];
  }, [userData]);

  const monthlyBudget = userData?.user?.monthlyBudget || 45000;
  const currentSpent = latestMonthly?.totalSpent || 0;
  const remaining = monthlyBudget - currentSpent;
  const percentUsed = monthlyBudget > 0 ? (currentSpent / monthlyBudget) * 100 : 0;

  const handleSaveBudget = () => {
    const num = Number(newBudgetVal);
    if (!isNaN(num) && num > 0) {
      updateUserProfile({ monthlyBudget: num });
      setIsEditingBudget(false);
    }
  };

  const categoryBudgets = useMemo(() => {
    const breakdown = latestMonthly?.categoryBreakdown || {};
    // Proportional category budget targets
    const defaultTargets: Record<string, number> = {
      Transportation: 12000,
      Shopping: 10000,
      Entertainment: 8000,
      Utilities: 7000,
      Education: 8000,
      Travel: 6000,
      Health: 5000,
      "Rent & Housing": 8000,
      Food: 12000,
      Miscellaneous: 5000,
    };

    return Object.entries(breakdown).map(([cat, spent]) => {
      const limit = defaultTargets[cat] || Math.max(10000, Math.round(spent * 1.15));
      const pct = (spent / limit) * 100;
      return {
        category: cat,
        spent,
        limit,
        percentage: pct,
        remaining: limit - spent,
      };
    });
  }, [latestMonthly]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 bg-transparent max-w-7xl w-full mx-auto">
      <div>
        <h1 className="text-heading2 lg:text-heading1 font-bold">Budgets</h1>
        <p className="text-gray-600 text-body1">
          Monitor your monthly budget limits and category spending thresholds
        </p>
      </div>

      {/* Main Budget Card */}
      <div className="bg-background rounded-2xl p-6 border border-3 border-gray-200 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-caption text-gray-500 font-semibold uppercase tracking-wider">
                Monthly Target Budget
              </span>
              {!isEditingBudget && (
                <button
                  onClick={() => setIsEditingBudget(true)}
                  className="text-primary hover:text-primary/80 transition-colors"
                  title="Edit Budget"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {isEditingBudget ? (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  value={newBudgetVal}
                  onChange={(e) => setNewBudgetVal(e.target.value)}
                  className="px-3 py-1.5 border border-primary rounded-lg text-heading2 font-bold w-44 bg-surface focus:outline-none"
                />
                <button
                  onClick={handleSaveBudget}
                  className="p-2 bg-success text-opposite rounded-lg hover:bg-success/90"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsEditingBudget(false)}
                  className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <p className="text-heading1 font-bold text-foreground mt-1">
                ₹{monthlyBudget.toLocaleString("en-IN")}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="bg-surface px-4 py-3 rounded-xl border border-gray-200">
              <span className="text-caption text-gray-500">Total Spent</span>
              <p className="text-heading3 font-bold text-danger">
                ₹{currentSpent.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="bg-surface px-4 py-3 rounded-xl border border-gray-200">
              <span className="text-caption text-gray-500">
                {remaining >= 0 ? "Remaining" : "Over Budget"}
              </span>
              <p
                className={`text-heading3 font-bold ${
                  remaining >= 0 ? "text-success" : "text-danger"
                }`}
              >
                ₹{Math.abs(remaining).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-body2 font-semibold">Budget Utilization</span>
            <span
              className={`text-body2 font-bold ${
                percentUsed > 100
                  ? "text-danger"
                  : percentUsed > 80
                  ? "text-warning"
                  : "text-success"
              }`}
            >
              {percentUsed.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${
                percentUsed > 100
                  ? "bg-danger"
                  : percentUsed > 80
                  ? "bg-warning"
                  : "bg-success"
              }`}
              style={{ width: `${Math.min(100, percentUsed)}%` }}
            />
          </div>

          <div className="flex items-center gap-2 mt-4 text-body2">
            {percentUsed > 100 ? (
              <div className="flex items-center gap-1.5 text-danger font-semibold">
                <AlertTriangle className="w-5 h-5" />
                <span>
                  You have exceeded your monthly budget by ₹
                  {Math.abs(remaining).toLocaleString("en-IN")}!
                </span>
              </div>
            ) : percentUsed > 80 ? (
              <div className="flex items-center gap-1.5 text-warning font-semibold">
                <TrendingDown className="w-5 h-5" />
                <span>
                  Warning: You have used {percentUsed.toFixed(0)}% of your monthly budget.
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-success font-semibold">
                <ShieldCheck className="w-5 h-5" />
                <span>
                  Great job! You are within your budget limits.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Budget Breakdown */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="text-heading2 font-bold">Category Budgets</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryBudgets.map((cb) => {
            const isExceeded = cb.percentage > 100;
            const isWarning = cb.percentage > 80 && !isExceeded;

            return (
              <div
                key={cb.category}
                className="bg-background rounded-xl p-5 border border-2 border-gray-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-heading3">{cb.category}</span>
                    <span
                      className={`text-body2 font-bold ${
                        isExceeded
                          ? "text-danger"
                          : isWarning
                          ? "text-warning"
                          : "text-success"
                      }`}
                    >
                      {cb.percentage.toFixed(0)}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden mb-3">
                    <div
                      className={`h-2.5 rounded-full ${
                        isExceeded
                          ? "bg-danger"
                          : isWarning
                          ? "bg-warning"
                          : "bg-primary"
                      }`}
                      style={{ width: `${Math.min(100, cb.percentage)}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-body2 pt-2 border-t border-gray-100">
                  <span className="text-gray-500">
                    Spent:{" "}
                    <strong className="text-foreground">
                      ₹{cb.spent.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </strong>
                  </span>
                  <span className="text-gray-500">
                    Limit:{" "}
                    <strong className="text-foreground">
                      ₹{cb.limit.toLocaleString("en-IN")}
                    </strong>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
