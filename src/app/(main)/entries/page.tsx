"use client";
import React, { useState } from "react";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import CustomDropdown from "@/components/UI/CustomDropdown";
import { Group, CreditCard, CheckCircle2 } from "lucide-react";
import TransactionHeader from "@/components/UI/TransactionHeader";
import TextArea from "@/components/UI/TextArea";
import QuickAdd from "@/components/MFA/QuickAddCard";
import { categories, modeOfPaymentOptions } from "./utility/constants";
import constants from "@/utilities/constants";
import { addTransaction } from "@/utilities/dataService";

const EntriesPage = () => {
  const [type, setType] = useState<"Expense" | "Income">("Expense");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );
  const [merchantName, setMerchantName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [modeOfPayment, setModeOfPayment] = useState<string | undefined>(
    undefined,
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [errors, setErrors] = useState<{
    name?: string;
    amount?: string;
    category?: string;
    paymentMode?: string;
  }>({});

  const validate = () => {
    const newErrors: {
      name?: string;
      amount?: string;
      category?: string;
      paymentMode?: string;
    } = {};

    if (!merchantName.trim()) {
      newErrors.name = "Name / Merchant is required";
    }

    const numAmount = Number(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = "Please enter a valid amount greater than 0";
    }

    if (!selectedCategory || selectedCategory === "Select category") {
      newErrors.category = "Category is required";
    }

    if (!modeOfPayment || modeOfPayment === "Select mode of payment") {
      newErrors.paymentMode = "Mode of payment is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSuccessMessage(null);

    const payload = {
      type,
      merchant: merchantName.trim(),
      amount: Number(amount),
      category: selectedCategory,
      paymentMode: modeOfPayment,
      notes: notes.trim(),
    };

    try {
      // 1. Call backend API if endpoint is available
      try {
        const entriesUrl = `${process.env.NEXT_PUBLIC_BACKEND_HOSTING_DOMAIN}${constants.NEW_TRANSACTION_API_URL}`;
        await fetch(entriesUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } catch (apiErr) {
        console.warn("Backend API not reachable; saved locally in session:", apiErr);
      }

      // 2. Persist locally to session storage via dataService
      addTransaction(payload);

      // 3. Reset form and provide success feedback
      setSuccessMessage(
        `${type} of ₹${Number(amount).toLocaleString()} added successfully!`
      );
      setMerchantName("");
      setAmount("");
      setSelectedCategory(undefined);
      setModeOfPayment(undefined);
      setNotes("");
      setErrors({});

      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    } catch (error) {
      console.error("❌ Error adding transaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <TransactionHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col row-span-2 bg-background gap-4 m-4 rounded-xl border border-3 border-gray-200 shadow-lg transition-all duration-400 p-8">
          {successMessage && (
            <div className="flex items-center gap-2 p-3 bg-success/15 border border-success/40 text-success rounded-xl font-medium text-body2 transition-all">
              <CheckCircle2 className="w-5 h-5" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="flex flex-col gap-4 w-full">
            <label className="font-semibold">Type</label>
            <div className="flex gap-4 w-full">
              <Button
                tabIndex={1}
                buttonLabel="Expense"
                variant="brand-secondary"
                tone="danger"
                onClick={() => {
                  setType("Expense");
                }}
                customClass={`flex flex-1 ${type === "Expense" ? "border-3 font-semibold" : "border-danger/50 text-danger/50"}`}
              />
              <Button
                tabIndex={2}
                buttonLabel="Income"
                variant="brand-secondary"
                tone="success"
                onClick={() => {
                  setType("Income");
                }}
                customClass={`flex flex-1 ${type === "Income" ? "border-3 font-semibold" : "border-success/50 text-success/50"}`}
              />
            </div>
          </div>
          <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
            <Input
              type="text"
              placeholder="e.g. Grocery Store or Employer"
              inputTitle={type === "Expense" ? "Merchant / Title" : "Payer / Source"}
              value={merchantName}
              error={!!errors.name}
              errorMessage={errors.name}
              tabIndex={3}
              name="merchant"
              onChange={(e) => {
                setMerchantName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
            />

            <Input
              type="number"
              placeholder="0.00"
              inputTitle="Amount (₹)"
              value={amount}
              error={!!errors.amount}
              errorMessage={errors.amount}
              tabIndex={4}
              name="amount"
              min="0"
              step="any"
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
              }}
            />

            <CustomDropdown
              icon={<Group />}
              inputTitle="Category"
              options={categories}
              onSelect={(category) => {
                setSelectedCategory(category);
                if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
              }}
              selectedOption={selectedCategory}
              name="category"
              tabIndex={5}
              error={!!errors.category}
            />

            <CustomDropdown
              icon={<CreditCard />}
              inputTitle="Mode of Payment"
              options={modeOfPaymentOptions}
              onSelect={(option) => {
                setModeOfPayment(option);
                if (errors.paymentMode) setErrors((prev) => ({ ...prev, paymentMode: undefined }));
              }}
              selectedOption={modeOfPayment}
              name="paymentMode"
              tabIndex={6}
              error={!!errors.paymentMode}
            />

            <TextArea
              inputTitle="Description (optional)"
              name="description"
              value={notes}
              placeholder="Optional notes or details..."
              onChange={(e) => setNotes(e.target.value)}
              autoCorrect="off"
            />

            <Button
              tabIndex={7}
              buttonLabel={isSubmitting ? "Adding..." : "Add Transaction"}
              variant="brand-primary"
              tone="primary"
              customClass="text-opposite font-semibold"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              onClick={() => {
                handleSubmit();
              }}
            />
          </form>
        </div>
        <QuickAdd />
      </div>
    </div>
  );
};

export default EntriesPage;
