import React from 'react';
import { BanknoteCheck, ReceiptIndianRupee, BanknoteArrowUp, BanknoteArrowDown, PiggyBank } from "lucide-react";
import style from './style';

const TransactionHeader = () => {
  return (
          <div className={style.headerWrappper}>
        <span>Add Transactions</span>
        <div className={style.stickerOuterWrapper1}><div className="w-24 h-24 p-2 bg-primary/60 rounded-full flex justify-center items-center hover:scale-115 transition-all duration-400 ease-in-out"><ReceiptIndianRupee className="w-10 h-10"/></div></div>
        <div className={style.stickerOuterWrapper2}><div className="w-10 h-10 p-2 bg-warning/40 rounded-full flex justify-center items-center hover:scale-125 transition-all duration-400 ease-in-out"><ReceiptIndianRupee className="w-10 h-10"/></div></div>
        <div className={style.stickerOuterWrapper3}><div className="w-10 h-10 p-2 bg-success rounded-full flex justify-center items-center hover:scale-125 transition-all duration-400 ease-in-out"><BanknoteArrowUp className="w-10 h-10"/></div></div>
        <div className={style.stickerOuterWrapper4}><div className="w-16 h-16 p-2 bg-danger/60 rounded-full flex justify-center items-center hover:scale-125 transition-all duration-400 ease-in-out"><BanknoteArrowDown className="w-10 h-10"/></div></div>
        <div className={style.stickerOuterWrapper5}><div className="w-12 h-12 p-2 bg-warning/60 rounded-full flex justify-center items-center hover:scale-125 transition-all duration-400 ease-in-out"><PiggyBank className="w-10 h-10"/></div></div>
      </div>
  )
}

export default TransactionHeader