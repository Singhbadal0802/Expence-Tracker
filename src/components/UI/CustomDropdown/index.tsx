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
  name,
  iconCustomClass
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
        {icon && <div className={style.inputIcon}>
           <span className={cn({
            ['text-primary'] : !iconCustomClass,
            [`${iconCustomClass}`] : iconCustomClass
           })}>{icon}</span>
        </div>}
        <select
          value={selectedOption}
          onChange={(e) => onSelect(e.target.value)}
          className={cn({
            [style.defaultInputClass]: true,
            ["border-danger"]: error,
          })}
          tabIndex={tabIndex}
          name={name}
        >
          {options.map((option, index) => (
            <option key={index} value={option?.value} className={cn({
                ["flex text-body1"]: true,
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
