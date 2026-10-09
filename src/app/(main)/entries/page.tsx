"use client";
import React, { useState } from "react";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import CustomDropdown from "@/components/UI/CustomDropdown";
import { Group, CreditCardReader  } from 'lucide-react';
import TransactionHeader from "@/components/UI/TransactionHeader";
import TextArea from "@/components/UI/TextArea";
import QuickAdd from "@/components/MFA/QuickAddCard";
import { inputFields, categories, modeOfPaymentOptions } from "./utility/constants";

const page = () => {
  const [type, setType] = useState<"Expense" | "Income">("Expense");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );
  const [merchantName, setMerchantName] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  const [modeOfPayment, setModeOfPayment] = useState<string | undefined>(
    undefined,
  );

  const handleSubmit = async () => {

  try{
    let payload = {
      "type": type,
      "merchant": merchantName,
      amount,
      "category": selectedCategory,
      "paymentMode": modeOfPayment,
      "notes": notes
    }
    console.log('payload-------------------------------', payload)
    // const entriesUrl = `${process.env.NEXT_PUBLIC_BACKEND_HOSTING_DOMAIN}${constants.NEW_TRANSACTION_API_URL}`;
    // const response = await fetch(entriesUrl, {
    //   method : "POST",
    //   headers : {
    //     "Content-Type" : "application/json"
    //   },
    //   body : JSON.stringify(payload)
    // })

    // const userData = await response.json();
    console.log('user-data-------------------------------')
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
                onChange={(e) => {
                  if (field.inputTitle === "Name") {
                    setMerchantName(e.target.value);
                  } else if (field.inputTitle === "Amount") {
                    setAmount(Number(e.target.value));
                  }
                }}
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
              tabIndex={5}
            />
            <CustomDropdown
              icon={<CreditCardReader />}
              inputTitle="Mode of Payment"
              options={modeOfPaymentOptions}
              onSelect={(option) => {
                setModeOfPayment(option);
              }}
              selectedOption={modeOfPayment}
              name="category"
              tabIndex={5}
            />
            <TextArea inputTitle="Description (optional)" name="description" onChange={(e)=>{setNotes(e.target.value)}} autoCorrect="off"/>
            <Button
              tabIndex={inputFields.length + 3}
              buttonLabel="Add Transaction"
              variant="brand-primary"
              tone="primary"
              customClass="text-opposite font-semibold"
              onClick={()=>{handleSubmit()}}
            />
          </form>
        </div>
        <QuickAdd/>
        {/* <QuickAdd/> */}
      </div>
    </div>
  );
};

export default page;
