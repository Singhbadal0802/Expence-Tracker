export const inputFields = [
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
export const categories = [
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

export const modeOfPaymentOptions = [
  { label: "Select mode of payment", value: undefined },
  { label: "Cash", value: "Cash" },
  { label: "Credit Card", value: "Credit Card" },
  { label: "Debit Card", value: "Debit Card" },
  { label: "UPI", value: "UPI" },
  { label: "Net Banking", value: "Net Banking" },
  { label: "Other", value: "Other" },
];
