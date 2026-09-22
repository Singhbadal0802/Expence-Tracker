import { cn } from "@/utilities/utility";
import React from "react";
import TextAreaProps from "./interface";

const TextArea = ({
  inputTitle = "Title",
  error = false,
  errorMessage = "Error message",
  name
}: TextAreaProps) => {
  return (
    <div className="flex flex-col">
      {inputTitle && (
        <label
          className={cn({
            ["font-semibold"]: true,
            ["text-danger"]: error,
          })}
        >
          {inputTitle}
        </label>
      )}
      <textarea className="border border-2 border-gray-200 rounded-xl p-2 text-gray-400" name={name}/>
      {error && errorMessage && <div className="text-danger/80">{errorMessage}</div>}
    </div>
  );
};

export default TextArea;
