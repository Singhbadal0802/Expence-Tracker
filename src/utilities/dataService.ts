import defaultExpenseData from "./expenceData.json";
import {
  ExpenseTrackerResponse,
  Expense,
  Income,
  User,
  ExpenseCategory,
  IncomeSource,
  PaymentMode,
} from "@/components/MFA/DashBoardCards/interface";

const DATA_KEY = "userData";
const USER_KEY = "userDetails";
export const DATA_CHANGED_EVENT = "expence_tracker_data_updated";

export function getStoredUserData(): ExpenseTrackerResponse {
  if (typeof window === "undefined") {
    return defaultExpenseData as unknown as ExpenseTrackerResponse;
  }

  const raw = sessionStorage.getItem(DATA_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as ExpenseTrackerResponse;
    } catch {
      // Fallback if parsing fails
    }
  }

  // Seed default data
  const seeded = defaultExpenseData as unknown as ExpenseTrackerResponse;
  sessionStorage.setItem(DATA_KEY, JSON.stringify(seeded));
  if (!sessionStorage.getItem(USER_KEY)) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(seeded.user));
  }
  return seeded;
}

export function saveUserData(data: ExpenseTrackerResponse): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DATA_KEY, JSON.stringify(data));
  if (data.user) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }
  window.dispatchEvent(new CustomEvent(DATA_CHANGED_EVENT, { detail: data }));
}

export function getStoredUserDetails(): User {
  if (typeof window === "undefined") {
    return (defaultExpenseData as unknown as ExpenseTrackerResponse).user;
  }

  const rawUser = sessionStorage.getItem(USER_KEY);
  if (rawUser) {
    try {
      return JSON.parse(rawUser) as User;
    } catch {
      // fallback
    }
  }

  const fullData = getStoredUserData();
  return fullData.user;
}

export interface NewTransactionPayload {
  type: "Expense" | "Income";
  merchant?: string | null;
  amount: number;
  category?: string;
  paymentMode?: string;
  notes?: string | null;
  date?: string;
}

export function addTransaction(payload: NewTransactionPayload): ExpenseTrackerResponse {
  const data = getStoredUserData();
  const currentDate = payload.date || new Date().toISOString().slice(0, 10);
  const currentMonth = currentDate.slice(0, 7);
  const currency = data.user?.currencyPreference || "INR";

  if (payload.type === "Expense") {
    const newExpense: Expense = {
      expenseId: `EXP-${Date.now()}`,
      date: currentDate,
      category: (payload.category as ExpenseCategory) || "Miscellaneous",
      merchant: payload.merchant?.trim() || "Expense",
      amount: payload.amount,
      currency,
      paymentMode: (payload.paymentMode as PaymentMode) || "UPI",
      notes: payload.notes || "",
    };

    data.expenses = [newExpense, ...(data.expenses || [])];

    // Update Summary
    if (data.summary) {
      data.summary.totalSpentLast12Months = Number(
        (data.summary.totalSpentLast12Months + payload.amount).toFixed(2)
      );
      data.summary.netSavingsLast12Months = Number(
        (data.summary.netSavingsLast12Months - payload.amount).toFixed(2)
      );
    }

    // Update Monthly Summary
    let monthly = data.monthlySummary.find((m) => m.month === currentMonth);
    if (!monthly) {
      monthly = {
        month: currentMonth,
        totalIncome: 0,
        totalSpent: 0,
        netSavings: 0,
        transactionCount: 0,
        categoryBreakdown: {},
        incomeBreakdown: {},
      };
      data.monthlySummary.push(monthly);
      data.monthlySummary.sort((a, b) => a.month.localeCompare(b.month));
    }

    monthly.totalSpent = Number((monthly.totalSpent + payload.amount).toFixed(2));
    monthly.netSavings = Number((monthly.totalIncome - monthly.totalSpent).toFixed(2));
    monthly.transactionCount += 1;

    const cat = newExpense.category;
    monthly.categoryBreakdown = monthly.categoryBreakdown || {};
    monthly.categoryBreakdown[cat] = Number(
      ((monthly.categoryBreakdown[cat] || 0) + payload.amount).toFixed(2)
    );
  } else {
    const newIncome: Income = {
      incomeId: `INC-${Date.now()}`,
      date: currentDate,
      source: (payload.category as IncomeSource) || "Salary",
      payer: payload.merchant?.trim() || "Income",
      amount: payload.amount,
      currency,
      paymentMode: (payload.paymentMode as PaymentMode) || "UPI",
    };

    data.income = [newIncome, ...(data.income || [])];

    // Update Summary
    if (data.summary) {
      data.summary.totalIncomeLast12Months = Number(
        (data.summary.totalIncomeLast12Months + payload.amount).toFixed(2)
      );
      data.summary.netSavingsLast12Months = Number(
        (data.summary.netSavingsLast12Months + payload.amount).toFixed(2)
      );
    }

    // Update Monthly Summary
    let monthly = data.monthlySummary.find((m) => m.month === currentMonth);
    if (!monthly) {
      monthly = {
        month: currentMonth,
        totalIncome: 0,
        totalSpent: 0,
        netSavings: 0,
        transactionCount: 0,
        categoryBreakdown: {},
        incomeBreakdown: {},
      };
      data.monthlySummary.push(monthly);
      data.monthlySummary.sort((a, b) => a.month.localeCompare(b.month));
    }

    monthly.totalIncome = Number((monthly.totalIncome + payload.amount).toFixed(2));
    monthly.netSavings = Number((monthly.totalIncome - monthly.totalSpent).toFixed(2));
    monthly.transactionCount += 1;

    const src = newIncome.source;
    monthly.incomeBreakdown = monthly.incomeBreakdown || {};
    monthly.incomeBreakdown[src] = Number(
      ((monthly.incomeBreakdown[src] || 0) + payload.amount).toFixed(2)
    );
  }

  saveUserData(data);
  return data;
}

export function deleteTransaction(
  id: string,
  type: "Expense" | "Income"
): ExpenseTrackerResponse {
  const data = getStoredUserData();

  if (type === "Expense") {
    const item = data.expenses?.find((e) => e.expenseId === id);
    if (!item) return data;

    data.expenses = data.expenses.filter((e) => e.expenseId !== id);

    if (data.summary) {
      data.summary.totalSpentLast12Months = Number(
        Math.max(0, data.summary.totalSpentLast12Months - item.amount).toFixed(2)
      );
      data.summary.netSavingsLast12Months = Number(
        (data.summary.netSavingsLast12Months + item.amount).toFixed(2)
      );
    }

    const monthStr = item.date.slice(0, 7);
    const monthly = data.monthlySummary.find((m) => m.month === monthStr);
    if (monthly) {
      monthly.totalSpent = Number(
        Math.max(0, monthly.totalSpent - item.amount).toFixed(2)
      );
      monthly.netSavings = Number((monthly.totalIncome - monthly.totalSpent).toFixed(2));
      monthly.transactionCount = Math.max(0, monthly.transactionCount - 1);
      if (monthly.categoryBreakdown && monthly.categoryBreakdown[item.category]) {
        monthly.categoryBreakdown[item.category] = Number(
          Math.max(0, (monthly.categoryBreakdown[item.category] || 0) - item.amount).toFixed(2)
        );
      }
    }
  } else {
    const item = data.income?.find((i) => i.incomeId === id);
    if (!item) return data;

    data.income = data.income.filter((i) => i.incomeId !== id);

    if (data.summary) {
      data.summary.totalIncomeLast12Months = Number(
        Math.max(0, data.summary.totalIncomeLast12Months - item.amount).toFixed(2)
      );
      data.summary.netSavingsLast12Months = Number(
        (data.summary.netSavingsLast12Months - item.amount).toFixed(2)
      );
    }

    const monthStr = item.date.slice(0, 7);
    const monthly = data.monthlySummary.find((m) => m.month === monthStr);
    if (monthly) {
      monthly.totalIncome = Number(
        Math.max(0, monthly.totalIncome - item.amount).toFixed(2)
      );
      monthly.netSavings = Number((monthly.totalIncome - monthly.totalSpent).toFixed(2));
      monthly.transactionCount = Math.max(0, monthly.transactionCount - 1);
      if (monthly.incomeBreakdown && monthly.incomeBreakdown[item.source]) {
        monthly.incomeBreakdown[item.source] = Number(
          Math.max(0, (monthly.incomeBreakdown[item.source] || 0) - item.amount).toFixed(2)
        );
      }
    }
  }

  saveUserData(data);
  return data;
}

export function updateUserProfile(updates: Partial<User>): User {
  const data = getStoredUserData();
  data.user = {
    ...data.user,
    ...updates,
  };
  saveUserData(data);
  return data.user;
}

export function resetToSampleData(): ExpenseTrackerResponse {
  const seeded = JSON.parse(JSON.stringify(defaultExpenseData)) as ExpenseTrackerResponse;
  saveUserData(seeded);
  return seeded;
}
