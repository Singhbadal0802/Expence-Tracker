import React from "react";
import { Zap, BadgeIndianRupee, Ungroup, ListSortDescending  } from "lucide-react";
import CustomDropdown from "@/components/UI/CustomDropdown";
import Button from "@/components/UI/Button";

const QuickAdd = () => {
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
    { label: "500", value: 500 },
    { label: "1000", value: 1000 },
    { label: "2000", value: 2000 },
    { label: "5000", value: 5000 },
    { label: "10000", value: 10000 },
  ];

    const typeArray = [
    { label: "Type", value: undefined },
    { label: "Expence", value: "Expence" },
    { label: "Income", value: "Income" },
  ];

  return (
    <div className="flex flex-col row-span-1 flex-1 gap-4 m-4 rounded-xl shadow-lg transition-all duration-400 border border-2 border-white overflow-hidden">
      <div className="flex flex-row items-center gap-4 font-semibold text-heading2 p-4 bg-warning/50">
        <Zap className="text-danger fill-danger" />
        Quick Add
      </div>
      <form className="flex flex-col mx-4 my-2 gap-4">
      <div className="flex flex-row items-center gap-4 font-regular text-heading3">
        <CustomDropdown options={AmmountArray} customClass="w-full bg-background rounded-xl [&>div:first-child>span]:!text-success" name="ammount" onSelect={()=>{}} icon={<BadgeIndianRupee />} iconCustomClass="text-success"/>
        <CustomDropdown options={categories} customClass="w-full bg-background rounded-xl" name="catagory" onSelect={()=>{}} icon={<Ungroup/>}/>
      </div>
      <div className="flex flex-row items-center gap-4 font-regular text-heading3">
        <CustomDropdown options={typeArray} customClass="w-full bg-background rounded-xl" name="catagory" onSelect={()=>{}} icon={<ListSortDescending/>} iconCustomClass="text-foreground"/>
        </div>
        <Button
            //@ts-ignore
              type="submit"
              buttonLabel="Add Transaction"
              variant="brand-primary"
              tone="success"
              customClass="font-semibold text-background"
            />
        </form>
    </div>
  );
};

export default QuickAdd;
