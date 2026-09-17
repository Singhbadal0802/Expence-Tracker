"use client";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import React, { useState } from "react";
import CustomDropdown from "@/components/UI/CustomDropdown";
import { Group } from "lucide-react";
import TransactionHeader from "@/components/UI/TransactionHeader";
import TextArea from "@/components/UI/TextArea";

const page = () => {
  const [type, setType] = useState<"Expense" | "Income">("Expense");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const inputFields = [
    {
      type: "text",
      placeholder: "Enter title",
      inputTitle: "Name",
      defaultValue: "",
      error: false,
      errorMessage: "Name is required",
    },
    {
      type: "number",
      placeholder: "Enter the ammount",
      inputTitle: "Ammount",
      error: false,
      errorMessage: "Email is required",
    },
  ];
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
  return (
    <div className="flex flex-col gap-4 w-full">
      <TransactionHeader />
      <div className="flex flex-col gap-4 w-[40%] m-4 rounded-xl border border-3 border-gray-200 min-w-[200px] shadow-lg transition-all duration-400 p-8">
        <div className="flex flex-col gap-4 w-full">
          <label className={"font-semibold"}>Type</label>
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
        <form className="flex flex-col gap-6 w-full">
          {inputFields.map((field, index) => (
            <Input
              key={index}
              type={field.type}
              placeholder={field.placeholder}
              inputTitle={field.inputTitle}
              defaultValue={field.defaultValue}
              error={field.error}
              errorMessage={field.errorMessage}
              tabIndex={index + 3}
            />
          ))}
          <CustomDropdown icon={<Group/>} inputTitle="Category" options={categories} onSelect={(category)=>{setSelectedCategory(category)}} selectedOption={selectedCategory}/>
          <TextArea inputTitle = "Description (optional)"/>
          <Button
            tabIndex={inputFields.length + 3}
            buttonLabel="Add Transaction"
            variant="brand-primary"
            tone="primary"
            onClick={() => {
              // Handle form submission logic here
              alert("TO DO: Implement form submission logic");
            }}
          />
        </form>
      </div>
    </div>
  );
};

export default page;
