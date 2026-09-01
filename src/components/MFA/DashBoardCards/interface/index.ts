export type Currency = "INR" | "USD" | "EUR" | string;

export type PaymentMode =
  | "UPI"
  | "Credit Card"
  | "Debit Card"
  | "Net Banking"
  | "Cash"
  | "Bank Transfer";

export type ExpenseCategory =
  | "Food & Dining"
  | "Transportation"
  | "Utilities"
  | "Entertainment"
  | "Shopping"
  | "Health"
  | "Rent & Housing"
  | "Travel"
  | "Education"
  | "Miscellaneous";

export type IncomeSource = "Salary" | "Freelance" | "Interest" | "Refund" | string;

export interface User {
  userId: string;
  name: string;
  email: string;
  phone: string;
  profileImageUrl: string;
  currencyPreference: Currency;
  joinedDate: string; // ISO date, e.g. "2024-03-15"
  monthlyBudget: number;
}

export interface Expense {
  expenseId: string;
  date: string; // ISO date, e.g. "2026-01-15"
  category: ExpenseCategory;
  merchant: string;
  amount: number;
  currency: Currency;
  paymentMode: PaymentMode;
  notes: string;
}

export interface Income {
  incomeId: string;
  date: string; // ISO date
  source: IncomeSource;
  payer: string;
  amount: number;
  currency: Currency;
  paymentMode: PaymentMode;
}

/** Map of category/source name -> total amount for that month */
export type CategoryBreakdown = Partial<Record<ExpenseCategory, number>>;
export type IncomeBreakdown = Partial<Record<IncomeSource, number>>;

export interface MonthlySummary {
  month: string; // "YYYY-MM"
  totalIncome: number;
  totalSpent: number;
  netSavings: number;
  transactionCount: number;
  categoryBreakdown: CategoryBreakdown;
  incomeBreakdown: IncomeBreakdown;
}

export interface Summary {
  periodStart: string; // "YYYY-MM"
  periodEnd: string; // "YYYY-MM"
  totalIncomeLast12Months: number;
  totalSpentLast12Months: number;
  netSavingsLast12Months: number;
  averageMonthlyIncome: number;
  averageMonthlySpend: number;
  highestSpendingMonth: string; // "YYYY-MM"
  lowestSpendingMonth: string; // "YYYY-MM"
  highestIncomeMonth: string; // "YYYY-MM"
}

export interface ExpenseTrackerResponse {
  user: User;
  summary: Summary;
  monthlySummary: MonthlySummary[];
  income: Income[];
  expenses: Expense[];
}

export interface DashboardCardsPorps {
  selectedMonth : string;
}