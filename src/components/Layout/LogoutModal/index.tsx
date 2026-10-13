"use client";
import Button from "@/components/UI/Button";
import React, { useState } from "react";

const LogoutModal = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const session = sessionStorage.getItem("nonLoginAccepted");
    const user = sessionStorage.getItem("userDetails");
    return !user && session !== "true";
  });

  const handleModalClose = () => {
    setIsModalOpen(false);
    sessionStorage.setItem("nonLoginAccepted", "true");
  };

  if (!isModalOpen) return null;

  return (
    <div className="flex justify-center items-center w-[100vw] h-[100vh] bg-foreground/40 fixed z-999 inset-0">
      <div className="flex flex-col bg-primary w-[80%] md:w-[50%] min-h-[50%] rounded-xl">
        <div className="flex justify-end w-full p-4 text-body1 font-medium text-opposite">
          <button
            onClick={handleModalClose}
            className="p-1 hover:opacity-80 text-heading3 font-bold"
            aria-label="Close Modal"
          >
            ✕
          </button>
        </div>
        <div className="flex m-8 md:mx-16 text-heading1 font-medium text-opposite">
          Looks like you haven&apos;t logged in, you&apos;re missing a lot of things
        </div>
        <div className="w-full flex my-8 bg-white h-auto p-4 px-16 justify-start gap-16">
          <Button
            buttonLabel="Login"
            variant="brand-primary"
            tone="success"
            customClass="text-heading3 font-semibold"
            onClick={() => {
              window.location.href = "/login";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
