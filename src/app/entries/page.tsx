"use client";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import React, { useState } from "react";
import CustomDropdown from "@/components/UI/CustomDropdown";
import { Group } from "lucide-react";
import TransactionHeader from "@/components/UI/TransactionHeader";
import TextArea from "@/components/UI/TextArea";
import constants from "@/utilities/constants";
import QuickAdd from "@/components/MFA/QuickAddCard";

const page = () => {
  const [type, setType] = useState<"Expense" | "Income">("Expense");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );

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
      placeholder: "Enter the amount",
      inputTitle: "Amount",
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

  const handleSubmit = async (event:any) => {
  event.preventDefault();

  const formData = new FormData(event.target);

  const data = Object.fromEntries(formData.entries());

  try{
    const entriesUrl = `${process.env.NEXT_PUBLIC_BACKEND_HOSTING_DOMAIN}${constants.NEW_TRANSACTION_API_URL}`;
    const response = await fetch(entriesUrl, {
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({"email" : "badalrkt23@gmail.com", "name" : "badal singh"})
    })

    const userData = await response.json();
    console.log('user-data-------------------------------',userData)
  }catch(error){
    console.error("❌", error)
  }
};

  return (
    <div className="flex flex-col w-full">
      <TransactionHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col row-span-2 bg-background gap-4 m-4 rounded-xl border border-3 border-gray-200 shadow-lg transition-all duration-400 p-8">
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
          <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
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
                name={field.inputTitle.toLowerCase()}
              />
            ))}
            <CustomDropdown
              icon={<Group />}
              inputTitle="Category"
              options={categories}
              onSelect={(category) => {
                setSelectedCategory(category);
              }}
              selectedOption={selectedCategory}
              name="category"
            />
            <TextArea inputTitle="Description (optional)" name="description"/>
            <Button
            //@ts-ignore
              type="submit"
              tabIndex={inputFields.length + 3}
              buttonLabel="Add Transaction"
              variant="brand-primary"
              tone="primary"
              customClass="text-opposite font-semibold"
            />
          </form>
        </div>
        <QuickAdd/>
        <QuickAdd/>
      </div>
    </div>
  );
};

export default page;
