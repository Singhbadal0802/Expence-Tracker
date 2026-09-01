import React from "react";
import labels from "@/utilities/labels";
import { GenericNumberCardProps } from "./interface";
import { icon, performanceText } from "./style";
import { cn } from "@/utilities/utility";

const GenericNumberCard = ({
  Ammount = 0,
  tone = "primary",
  title,
  IconName,
  performance,
  currencySymbol = "Rs.",
  performanceAmmount,
  isLoading,
}: GenericNumberCardProps) => {
  return (
    <div className="flex flex-1 flex-col m-0 my-4 md:m-4 p-4 gap-2 rounded-xl border border-3 border-gray-200 min-w-[200px] shadow-lg transition-all duration-400">
      <div className="flex flex-row w-full justify-between items-center">
        <div className="text-body1 font-regular text-gray-500">{title}</div>
        <div className={icon({ colorTone: tone })}>
          {IconName && <IconName />}
        </div>
      </div>
      <div
        className={cn({
          ["text-heading1 font-semibold gap-4 px-2 rounded-md"]: true,
          ["h-10 bg-gray-200 animate-pulse transition-all"]: isLoading,
        })}
      >
        {!isLoading ? (
          <>
            <span className="text-heading2">{currencySymbol}</span>{" "}
            {Number(Ammount).toFixed(2)}
          </>
        ) : (
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_0.8s_infinite] bg-gradient-to-r from-transparent via-white to-transparent" />
        )}
      </div>
      <div
        className={cn({
          ["flex flex-row gap-2 rounded-md"]: true,
          ["h-8 w-full bg-gray-200 animate-pulse"]: isLoading,
        })}
      >
        {isLoading ? (
           <div className="absolute inset-0 -translate-x-full animate-[shimmer_0.8s_infinite] bg-gradient-to-r from-transparent via-white to-transparent" />
        ) : (
          <>
            <div
              className={performanceText({
                colorTone: performance === "Increase" ? "success" : "danger",
              })}
            >
              <span className="font-bold p-1">
                {performance === "Increase" ? "↗" : "↘"}
              </span>
              {Math.abs(performanceAmmount)} %
            </div>
            <span className="text-body1 font-regular text-gray-500">
              {labels.FROM_LAST_MONTH}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default GenericNumberCard;
