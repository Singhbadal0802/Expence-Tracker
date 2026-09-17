import React from "react";
import { CustomDropdownProps } from "./interface";
import { cn } from "@/utilities/utility";
import style from "./style";

const CustomDropdown = ({
  options = [],
  selectedOption,
  onSelect = () => {},
  customClass,
  tabIndex,
  icon,
  inputTitle = "",
  error = false,
}: CustomDropdownProps) => {
  return (
    <div className={cn({
        [style.dropdownWrapper]: true,
        [customClass ?? ""]: customClass,
    })}>
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
      <div className={style.inputWrapper}>
        <div className={style.inputIcon}>
          {icon && <span className="text-primary">{icon}</span>}
        </div>
        <select
          value={selectedOption}
          onChange={(e) => onSelect(e.target.value)}
          className={cn({
            [style.defaultInputClass]: true,
            ["border-danger"]: error,
          })}
          tabIndex={tabIndex}
        >
          {options.map((option, index) => (
            <option key={index} value={option?.value} className={cn({
                ["flex text-body1 text-foreground"]: true,
                ["font-semibold bg-gray-200"]: (index === 0 && typeof option?.value === "undefined"),
            })}>
              {option?.label}
            </option>
          ))}
        </select>
      </div>
        {error && (
            <span className={style.errorMessage}>
                {error ?? ""}
            </span>
        )}
    </div>
  );
};

export default CustomDropdown;
