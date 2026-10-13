"use client";
import React, { useMemo } from "react";
import { BarGraphProps } from "./interface";
import { TrendingUp } from "lucide-react";

const formatMonthLabel = (monthStr: string) => {
  if (!monthStr) return "";
  const [year, month] = monthStr.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleString("en-US", { month: "short" });
};

const BarGraph = ({ monthlyData = [], title = "Income vs Expenses" }: BarGraphProps) => {
  const chartData = useMemo(() => {
    if (!monthlyData || monthlyData.length === 0) return [];
    // Take the last 6 months
    return monthlyData.slice(-6);
  }, [monthlyData]);

  const maxVal = useMemo(() => {
    if (chartData.length === 0) return 100000;
    const max = Math.max(
      ...chartData.flatMap((d) => [d.totalIncome || 0, d.totalSpent || 0])
    );
    return max > 0 ? max * 1.15 : 100000;
  }, [chartData]);

  return (
    <div className="flex flex-col w-full h-full gap-4">
      <div className="flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="text-heading3 font-semibold">{title}</h3>
        </div>
        <div className="flex items-center gap-4 text-caption font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-success inline-block" />
            <span className="text-gray-500">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-danger inline-block" />
            <span className="text-gray-500">Expenses</span>
          </div>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-400">
          No monthly data available
        </div>
      ) : (
        <div className="flex flex-col flex-1 min-h-[220px] justify-end pt-4">
          <div className="grid grid-cols-6 gap-2 sm:gap-4 h-44 items-end border-b-2 border-gray-200 pb-2">
            {chartData.map((item) => {
              const incomeHeight = Math.min(100, Math.max(8, ((item.totalIncome || 0) / maxVal) * 100));
              const expenseHeight = Math.min(100, Math.max(8, ((item.totalSpent || 0) / maxVal) * 100));

              return (
                <div
                  key={`month-${item.month}`}
                  className="flex flex-col items-center h-full justify-end group relative"
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-[11px] p-1.5 rounded shadow-lg pointer-events-none z-10 whitespace-nowrap">
                    <div>Inc: ₹{(item.totalIncome || 0).toLocaleString()}</div>
                    <div>Exp: ₹{(item.totalSpent || 0).toLocaleString()}</div>
                  </div>

                  <div className="flex items-end gap-1 sm:gap-2 w-full justify-center h-full">
                    {/* Income Bar */}
                    <div
                      style={{ height: `${incomeHeight}%` }}
                      className="w-3 sm:w-5 bg-success/80 group-hover:bg-success rounded-t-md transition-all duration-300"
                      title={`Income: ₹${item.totalIncome?.toLocaleString()}`}
                    />
                    {/* Expense Bar */}
                    <div
                      style={{ height: `${expenseHeight}%` }}
                      className="w-3 sm:w-5 bg-danger/80 group-hover:bg-danger rounded-t-md transition-all duration-300"
                      title={`Expense: ₹${item.totalSpent?.toLocaleString()}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Month Labels */}
          <div className="grid grid-cols-6 gap-2 sm:gap-4 pt-2">
            {chartData.map((item) => (
              <div
                key={`lbl-${item.month}`}
                className="text-center text-caption text-gray-500 font-medium"
              >
                {formatMonthLabel(item.month)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BarGraph;
