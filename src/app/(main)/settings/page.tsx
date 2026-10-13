"use client";

import React, { useState, useEffect } from "react";
import { RotateCcw, Download, CheckCircle2 } from "lucide-react";
import Button from "@/components/UI/Button";
import {
  getStoredUserData,
  updateUserProfile,
  resetToSampleData,
  DATA_CHANGED_EVENT,
} from "@/utilities/dataService";

export default function SettingsPage() {
  const [currency, setCurrency] = useState<string>(() => {
    const data = getStoredUserData();
    return data?.user?.currencyPreference || "INR";
  });
  const [monthlyBudget, setMonthlyBudget] = useState<string>(() => {
    const data = getStoredUserData();
    return String(data?.user?.monthlyBudget || 45000);
  });
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      const updated = getStoredUserData();
      setCurrency(updated?.user?.currencyPreference || "INR");
      setMonthlyBudget(String(updated?.user?.monthlyBudget || 45000));
    };

    window.addEventListener(DATA_CHANGED_EVENT, handleUpdate);
    return () => {
      window.removeEventListener(DATA_CHANGED_EVENT, handleUpdate);
    };
  }, []);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetNum = Number(monthlyBudget);
    if (!isNaN(budgetNum) && budgetNum > 0) {
      updateUserProfile({
        currencyPreference: currency,
        monthlyBudget: budgetNum,
      });
      setSavedFeedback("Preferences saved successfully!");
      setTimeout(() => setSavedFeedback(null), 3000);
    }
  };

  const handleResetData = () => {
    if (confirm("Reset to original sample dataset? Any unsaved local edits will be replaced.")) {
      resetToSampleData();
      setSavedFeedback("Reset to sample dataset successfully!");
      setTimeout(() => setSavedFeedback(null), 3000);
    }
  };

  const handleExportJSON = () => {
    const data = getStoredUserData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ExpenseTracker_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 bg-transparent max-w-4xl w-full mx-auto">
      <div>
        <h1 className="text-heading2 lg:text-heading1 font-bold">Settings</h1>
        <p className="text-gray-600 text-body1">
          Customize your preferences, currency, and financial data management
        </p>
      </div>

      {savedFeedback && (
        <div className="flex items-center gap-2 p-3 bg-success/15 border border-success/40 text-success rounded-xl font-medium text-body2">
          <CheckCircle2 className="w-5 h-5" />
          <span>{savedFeedback}</span>
        </div>
      )}

      {/* General Preferences */}
      <form
        onSubmit={handleSavePreferences}
        className="bg-background rounded-2xl p-6 border border-2 border-gray-200 shadow-md flex flex-col gap-6"
      >
        <h2 className="text-heading3 font-bold border-b border-gray-100 pb-3">
          Financial Preferences
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-body2">Currency Preference</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="p-3 border border-gray-300 rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
            >
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold text-body2">Default Monthly Budget</label>
            <input
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              className="p-3 border border-gray-300 rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-primary/40 font-medium"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            buttonLabel="Save Preferences"
            variant="brand-primary"
            tone="primary"
            customClass="text-opposite font-semibold"
          />
        </div>
      </form>

      {/* Data Management */}
      <div className="bg-background rounded-2xl p-6 border border-2 border-gray-200 shadow-md flex flex-col gap-6">
        <h2 className="text-heading3 font-bold border-b border-gray-100 pb-3">
          Data & Backup
        </h2>

        <div className="flex flex-col divide-y divide-gray-100">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center py-4 gap-4">
            <div>
              <h3 className="font-semibold text-body1">Export Financial Data</h3>
              <p className="text-body2 text-gray-500">
                Download a complete JSON backup of your transactions, categories, and summaries.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportJSON}
              className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-100 font-semibold text-body2 flex items-center gap-2 self-start sm:self-auto"
            >
              <Download className="w-4 h-4" /> Export Backup
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center py-4 gap-4">
            <div>
              <h3 className="font-semibold text-body1">Reset to Sample Dataset</h3>
              <p className="text-body2 text-gray-500">
                Restore the default comprehensive dataset with 12-month records.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetData}
              className="px-4 py-2 border border-warning/50 text-warning hover:bg-warning/10 rounded-xl font-semibold text-body2 flex items-center gap-2 self-start sm:self-auto"
            >
              <RotateCcw className="w-4 h-4" /> Reset Data
            </button>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-background rounded-2xl p-6 border border-2 border-gray-200 shadow-md">
        <h2 className="text-heading3 font-bold border-b border-gray-100 pb-3 mb-4">
          About Expence Tracker
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-body2">
          <div>
            <span className="text-gray-400 block text-caption">Version</span>
            <span className="font-semibold">0.1.0 (Production)</span>
          </div>
          <div>
            <span className="text-gray-400 block text-caption">Framework</span>
            <span className="font-semibold">Next.js 16 + React 19</span>
          </div>
          <div>
            <span className="text-gray-400 block text-caption">Storage</span>
            <span className="font-semibold">Session & Cloud API</span>
          </div>
        </div>
      </div>
    </div>
  );
}
