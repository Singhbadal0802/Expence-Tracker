"use client";
import Button from "@/components/UI/Button";
import React, { useEffect, useState } from "react";

const LogoutModal = () => {
  const [sessionValue, setSessionValue] = useState<any>("");
  const [userDetails, setUserDetails] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleModalClose = () => {
    setIsModalOpen(false);
    sessionStorage.setItem("nonLoginAccepted", "true");
  };

  useEffect(() => {
    const session = sessionStorage.getItem("nonLoginAccepted");
    sessionStorage.getItem("userDetails") && setUserDetails(JSON.parse(sessionStorage.getItem("userDetails") || ""));
    setSessionValue(session ?  session !== 'true' : true);
    console.log('sessionValue====', session !== 'true')
  }, []);

  useEffect(() => {
    setIsModalOpen(sessionValue);
  },[sessionValue])

  return (
    <>
      {!userDetails && isModalOpen && (
        <div className="flex justify-center items-center w-[100vw] h-[100vh] bg-foreground/40 fixed z-999">
          <div className="flex flex-col bg-primary w-[80%] md:w-[50%] min-h-[50%] rounded-xl">
            <div className="flex justify-end w-full p-4 text-body1 font-medium text-opposite">
              <button onClick={handleModalClose}>X</button>
            </div>
            <div className="flex m-8 md:mx-16 text-heading1 font-medium text-opposite">
              Looks like you haven't logged in, you're missing a lot of things
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
      )}
    </>
  );
};

export default LogoutModal;
