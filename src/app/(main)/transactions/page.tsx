"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Trash2,
  Filter,
} from "lucide-react";
import Button from "@/components/UI/Button";
import {
  getStoredUserData,
  deleteTransaction,
  DATA_CHANGED_EVENT,
} from "@/utilities/dataService";
import { ExpenseTrackerResponse } from "@/components/MFA/DashBoardCards/interface";

interface TransactionRow {
  id: string;
  type: "Expense" | "Income";
  title: string;
  category: string;
  amount: number;
  date: string;
  paymentMode: string;
  notes?: string;
}

export default function TransactionsPage() {
  const [userData, setUserData] = useState<ExpenseTrackerResponse | null>(() => {
    return getStoredUserData();
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterType, setFilterType] = useState<"All" | "Expense" | "Income">("All");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "amount-desc" | "amount-asc">("date-desc");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setUserData(getStoredUserData());
    };

    window.addEventListener(DATA_CHANGED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(DATA_CHANGED_EVENT, handleUpdate);
    };
  }, []);

  const allTransactions = useMemo(() => {
    if (!userData) return [];

    const list: TransactionRow[] = [];

    (userData.expenses || []).forEach((e) => {
      list.push({
        id: e.expenseId,
        type: "Expense",
        title: e.merchant,
        category: e.category,
        amount: e.amount,
        date: e.date,
        paymentMode: e.paymentMode,
        notes: e.notes,
      });
    });

    (userData.income || []).forEach((i) => {
      list.push({
        id: i.incomeId,
        type: "Income",
        title: i.payer,
        category: i.source,
        amount: i.amount,
        date: i.date,
        paymentMode: i.paymentMode,
      });
    });

    return list;
  }, [userData]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    allTransactions.forEach((t) => {
      if (t.category) cats.add(t.category);
    });
    return ["All", ...Array.from(cats)];
  }, [allTransactions]);

  const filteredTransactions = useMemo(() => {
    return allTransactions
      .filter((t) => {
        // Type filter
        if (filterType !== "All" && t.type !== filterType) return false;

        // Category filter
        if (filterCategory !== "All" && t.category !== filterCategory) return false;

        // Search term
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchesTitle = t.title?.toLowerCase().includes(query);
          const matchesCategory = t.category?.toLowerCase().includes(query);
          const matchesNotes = t.notes?.toLowerCase().includes(query);
          const matchesMode = t.paymentMode?.toLowerCase().includes(query);
          if (!matchesTitle && !matchesCategory && !matchesNotes && !matchesMode) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "date-desc") return b.date.localeCompare(a.date);
        if (sortBy === "date-asc") return a.date.localeCompare(b.date);
        if (sortBy === "amount-desc") return b.amount - a.amount;
        if (sortBy === "amount-asc") return a.amount - b.amount;
        return 0;
      });
  }, [allTransactions, filterType, filterCategory, searchTerm, sortBy]);

  const totals = useMemo(() => {
    let income = 0;
    let expense = 0;
    filteredTransactions.forEach((t) => {
      if (t.type === "Income") income += t.amount;
      else expense += t.amount;
    });
    return {
      income,
      expense,
      net: income - expense,
      count: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  const handleDelete = (id: string, type: "Expense" | "Income") => {
    deleteTransaction(id, type);
    setDeletingId(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 bg-transparent max-w-7xl w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-heading2 lg:text-heading1 font-bold">Transactions</h1>
          <p className="text-gray-600 text-body1">
            View, filter, and manage all your income and expenses
          </p>
        </div>
        <a href="/entries">
          <Button
            buttonLabel="Add Transaction"
            variant="brand-primary"
            tone="primary"
            customClass="text-opposite font-semibold flex items-center gap-2"
          />
        </a>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-background rounded-xl p-4 border border-2 border-gray-200 shadow-sm">
          <span className="text-caption text-gray-500 font-medium">Total Entries</span>
          <p className="text-heading2 font-bold mt-1">{totals.count}</p>
        </div>
        <div className="bg-background rounded-xl p-4 border border-2 border-gray-200 shadow-sm">
          <span className="text-caption text-gray-500 font-medium">Filtered Income</span>
          <p className="text-heading2 font-bold text-success mt-1">
            +₹{totals.income.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-background rounded-xl p-4 border border-2 border-gray-200 shadow-sm">
          <span className="text-caption text-gray-500 font-medium">Filtered Expenses</span>
          <p className="text-heading2 font-bold text-danger mt-1">
            -₹{totals.expense.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="bg-background rounded-xl p-4 border border-2 border-gray-200 shadow-sm">
          <span className="text-caption text-gray-500 font-medium">Net Balance</span>
          <p
            className={`text-heading2 font-bold mt-1 ${
              totals.net >= 0 ? "text-success" : "text-danger"
            }`}
          >
            {totals.net >= 0 ? "+" : "-"}₹
            {Math.abs(totals.net).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 bg-background p-4 rounded-xl border border-2 border-gray-200 shadow-sm items-stretch lg:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by merchant, note, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-body1 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Type Filter Buttons */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-surface">
            {(["All", "Expense", "Income"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 text-body2 font-medium transition-colors ${
                  filterType === t
                    ? "bg-primary text-opposite font-semibold"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-body2 bg-surface focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value as "date-desc" | "date-asc" | "amount-desc" | "amount-asc"
              )
            }
            className="border border-gray-300 rounded-lg px-3 py-2 text-body2 bg-surface focus:outline-none"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex flex-col bg-background rounded-xl border border-2 border-gray-200 shadow-lg overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <p className="text-heading3 font-semibold text-gray-500">
              No transactions found
            </p>
            <p className="text-body2 text-gray-400 mt-1">
              Try adjusting your search query or filters, or add a new transaction.
            </p>
            <a href="/entries" className="mt-4">
              <Button
                buttonLabel="Add New Transaction"
                variant="brand-primary"
                tone="primary"
                customClass="text-opposite"
              />
            </a>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50/80 transition-colors gap-3"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl flex-shrink-0 ${
                      tx.type === "Income"
                        ? "bg-success/15 text-success"
                        : "bg-danger/15 text-danger"
                    }`}
                  >
                    {tx.type === "Income" ? (
                      <ArrowDownLeft className="w-5 h-5" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span className="font-semibold text-body1 text-foreground">
                      {tx.title}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5">
                      <span className="text-caption px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                        {tx.category}
                      </span>
                      {tx.paymentMode && (
                        <span className="text-caption px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full font-medium">
                          {tx.paymentMode}
                        </span>
                      )}
                      <span className="text-caption text-gray-400">{tx.date}</span>
                    </div>
                    {tx.notes && (
                      <p className="text-caption text-gray-500 italic mt-1 line-clamp-1">
                        &ldquo;{tx.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                  <div className="text-right">
                    <span
                      className={`text-heading3 font-bold ${
                        tx.type === "Income" ? "text-success" : "text-danger"
                      }`}
                    >
                      {tx.type === "Income" ? "+" : "-"}₹
                      {tx.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  {deletingId === tx.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(tx.id, tx.type)}
                        className="px-2.5 py-1 bg-danger text-opposite text-caption font-semibold rounded hover:bg-danger/90"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-2 py-1 bg-gray-200 text-gray-700 text-caption rounded hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(tx.id)}
                      className="p-2 text-gray-400 hover:text-danger rounded-lg hover:bg-danger/10 transition-colors"
                      title="Delete Transaction"
                      aria-label="Delete Transaction"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
