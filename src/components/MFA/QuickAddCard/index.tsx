"use client";
import React, { useState } from "react";
import { Zap, BadgeIndianRupee, Ungroup, ListFilter, CheckCircle2 } from "lucide-react";
import CustomDropdown from "@/components/UI/CustomDropdown";
import Button from "@/components/UI/Button";
import { addTransaction } from "@/utilities/dataService";
import constants from "@/utilities/constants";

const QuickAdd = () => {
  const [selectedAmount, setSelectedAmount] = useState<string | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedType, setSelectedType] = useState<"Expense" | "Income">("Expense");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const categories = [
    { label: "Select category", value: undefined },
    { label: "Food", value: "Food" },
    { label: "Transport", value: "Transport" },
    { label: "Shopping", value: "Shopping" },
    { label: "Entertainment", value: "Entertainment" },
    { label: "Health", value: "Health" },
    { label: "Education", value: "Education" },
    { label: "Bills", value: "Bills" },
    { label: "Other", value: "Other" },
  ];

  const AmmountArray = [
    { label: "Amount", value: undefined },
    { label: "₹500", value: 500 },
    { label: "₹1,000", value: 1000 },
    { label: "₹2,000", value: 2000 },
    { label: "₹5,000", value: 5000 },
    { label: "₹10,000", value: 10000 },
  ];

  const typeArray = [
    { label: "Type", value: undefined },
    { label: "Expense", value: "Expense" },
    { label: "Income", value: "Income" },
  ];

  const handleQuickSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg(null);

    const amountNum = Number(selectedAmount);
    if (!selectedAmount || isNaN(amountNum) || amountNum <= 0) {
      setErrorMsg("Please select an amount");
      return;
    }

    setIsSubmitting(true);
    const categoryName = selectedCategory && selectedCategory !== "Select category"
      ? selectedCategory
      : "Miscellaneous";

    const payload = {
      type: selectedType,
      merchant: `Quick ${categoryName}`,
      amount: amountNum,
      category: categoryName,
      paymentMode: "UPI",
      notes: "Added via Quick Add",
    };

    try {
      // 1. Backend call
      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_HOSTING_DOMAIN}${constants.NEW_TRANSACTION_API_URL}`;
        await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (apiErr) {
        console.warn("Backend API not reachable; saved locally:", apiErr);
      }

      // 2. Local persistence
      addTransaction(payload);

      setSuccess(true);
      setSelectedAmount(undefined);
      setSelectedCategory(undefined);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("❌ Quick add error:", err);
      setErrorMsg("Failed to add transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col row-span-1 flex-1 gap-4 m-4 rounded-xl shadow-lg transition-all duration-400 border border-2 border-white overflow-hidden bg-background">
      <div className="flex flex-row items-center justify-between p-4 bg-warning/50">
        <div className="flex flex-row items-center gap-4 font-semibold text-heading2">
          <Zap className="text-danger fill-danger" />
          Quick Add
        </div>
        {success && (
          <div className="flex items-center gap-1 text-success text-body2 font-semibold">
            <CheckCircle2 className="w-5 h-5" />
            Added!
          </div>
        )}
      </div>

      <form className="flex flex-col mx-4 my-2 gap-4" onSubmit={handleQuickSubmit}>
        {errorMsg && (
          <p className="text-danger text-body2 font-medium">{errorMsg}</p>
        )}

        <div className="flex flex-row items-center gap-4 font-regular text-heading3">
          <CustomDropdown
            options={AmmountArray}
            customClass="w-full bg-background rounded-xl [&>div:first-child>span]:!text-success"
            name="amount"
            selectedOption={selectedAmount}
            onSelect={(val) => {
              setSelectedAmount(val);
              setErrorMsg(null);
            }}
            icon={<BadgeIndianRupee />}
            iconCustomClass="text-success"
          />
          <CustomDropdown
            options={categories}
            customClass="w-full bg-background rounded-xl"
            name="category"
            selectedOption={selectedCategory}
            onSelect={(cat) => setSelectedCategory(cat)}
            icon={<Ungroup />}
          />
        </div>

        <div className="flex flex-row items-center gap-4 font-regular text-heading3">
          <CustomDropdown
            options={typeArray}
            customClass="w-full bg-background rounded-xl"
            name="type"
            selectedOption={selectedType}
            onSelect={(t) => setSelectedType((t as "Expense" | "Income") || "Expense")}
            icon={<ListFilter />}
            iconCustomClass="text-foreground"
          />
        </div>

        <Button
          buttonLabel={isSubmitting ? "Adding..." : "Add Transaction"}
          variant="brand-primary"
          tone="success"
          customClass="font-semibold text-background"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          onClick={() => {
            handleQuickSubmit();
          }}
        />
      </form>
    </div>
  );
};

export default QuickAdd;
