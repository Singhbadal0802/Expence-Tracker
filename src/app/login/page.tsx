"use client";
import Button from "@/components/UI/Button";
import constants from "@/utilities/constants";
import { useEffect, useState } from "react";
import { fetchUserData } from "./utility";

const Login = () => {
  const [stateValue, setStateValue] = useState<"login" | "register">(
    "register",
  );
  const [loginEmailValue, setLoginEmailValue] = useState<string>("");
  const [registerEmailValue, setRegisterEmailValue] = useState<string>("");
  const [registerName, setRegisterName] = useState<string>("");
  const [loginPassword, setLoginPassword] = useState<string>("");
  const [registerPassword, setRegisterPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleLonginSubmit = async () => {
    if (loginEmailValue && loginPassword) {
      setIsLoading(true);
      try {
        let payload = {
          email: loginEmailValue,
          password: loginPassword,
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_HOSTING_DOMAIN}${constants.USER_LOGIN_ENDPOINT}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );

        const data = await response.json();

        if (data && data.token && data.user) {
          const userData = await fetchUserData(loginEmailValue);
          sessionStorage.setItem("userDetails", JSON.stringify(data.user));
          sessionStorage.setItem("userData", JSON.stringify(userData));
          setIsLoading(false);
          window.location.href = "/";
        }
      } catch (error) {
        console.log("❌ Error fetching user details : ", error);
      }
    }
  };

  const handleNewRegister = async () => {
    if (registerEmailValue && registerPassword && registerName) {
      debugger;
      setIsLoading(true);
      try {
        let payload = {
          name: registerName,
          email: registerEmailValue,
          password: registerPassword,
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_HOSTING_DOMAIN}${constants.NEW_USER_REGISTER_ENDPOINT}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          },
        );

        const res = await response.json();

        if (res?.data && res?.data.token && res?.data.user) {
          const userData = await fetchUserData(registerEmailValue);
          sessionStorage.setItem("userDetails", JSON.stringify(res.data.user));
          sessionStorage.setItem("userData", JSON.stringify(userData));
          setIsLoading(false);
          window.location.href = "/";
        }
        console.log("success data found-------------------------", res.data);
      } catch (err) {
        console.error("🔴 Error to create a new user : ", err);
      }
    }
  };

  useEffect(() => {
    sessionStorage.removeItem("nonLoginAccepted");
  }, []);

  return (
    <div className="flex w-full justify-center items-center h-[100vh] bg-light inset-shadow-white">
      <div className="relative grid grid-cols-2 w-[70%] h-[70%] overflow-hidden rounded-lg z-2 transition-all delay-400 duration-600 ease-in-out border border-1 border-primary/50 px-2 backdrop-blur-sm">
        <div className="flex justify-center rounded-full bg-primary/20 absolute -top-10 -left-20 p-4 z-3 animate-pulse duration-400">
          <div className="w-40 h-40 rounded-full bg-primary"></div>
        </div>
        <div
          className={`w-[50%] h-[800px] bg-white absolute -top-20 ${stateValue === "login" ? "-left-25 -rotate-20" : "left-[625px] rotate-20"} z-1 transition-all duration-600 ease-in-out`}
        >
          <div
            className={
              "flex flex-col justify-center items-center w-full h-full bg-primary/30 rounded-lg"
            }
          >
            <div
              className={`text-not-convertable text-heading1 font-bold m-4 transition-all ${stateValue === "login" ? "rotate-20 text-left ml-40" : "-rotate-20 text-right mr-40"} transition-all duration-600 ease-in-out`}
            >
              {stateValue === "login"
                ? "If already with us, Click here"
                : "New here..? click to join us"}
            </div>
            <Button
              buttonLabel={stateValue === "register" ? "Signup" : "Login"}
              variant="brand-primary"
              tone="primary"
              onClick={() => {
                setStateValue(stateValue === "login" ? "register" : "login");
              }}
              customClass={`${stateValue === "login" ? "rotate-20" : "-rotate-20"} transition-all duration-600 ease-in-out text-opposite`}
            />
          </div>
        </div>
        <form className="flex flex-col justify-center items-center m-auto gap-8">
          {/* <input className="rounded-lg border border-1 border-primary px-2 py-4 bg-gray-100" type="name" placeholder="name"/> */}
          <input
            className="text-not-convertable rounded-lg border border-1 border-primary p-2 bg-gray-100"
            type="email"
            placeholder="abc@gmail.com"
            onChange={(e) => {
              setLoginEmailValue(e.target.value);
            }}
          />
          <input
            className="text-not-convertable rounded-lg border border-1 border-primary p-2 bg-gray-100"
            type="password"
            placeholder="password"
            onChange={(e) => {
              setLoginPassword(e.target.value);
            }}
          />
          <Button
            variant="brand-primary"
            tone="success"
            buttonLabel="login"
            onClick={handleLonginSubmit}
            customClass={`flex w-full justify-center text-lg ${isLoading ? "backdrop-blur-sm opacity-[50%]" : ""}`}
            isLoading={isLoading}
            disabled={isLoading}
          />
        </form>
        <div className="flex justify-center items-center m-auto">
          <form className="flex flex-col justify-center items-center m-auto gap-8">
            <input
              className="text-not-convertable rounded-lg border border-1 border-primary p-2 bg-gray-100"
              type="name"
              placeholder="name"
              onChange={(e) => {
                setRegisterName(e.target.value);
              }}
            />
            <input
              className="text-not-convertable rounded-lg border border-1 border-primary p-2 bg-gray-100"
              type="email"
              placeholder="abc@gmail.com"
              onChange={(e) => {
                setRegisterEmailValue(e.target.value);
              }}
            />
            <input
              className="text-not-convertable rounded-lg border border-1 border-primary p-2 bg-gray-100"
              type="password"
              placeholder="password"
              onChange={(e) => {
                setRegisterPassword(e.target.value);
              }}
            />
            <Button
              variant="brand-primary"
              tone="success"
              buttonLabel="Signup"
              onClick={handleNewRegister}
              isLoading={isLoading}
              customClass={`flex w-full justify-center text-lg ${isLoading ? "backdrop-blur-sm opacity-[50%]" : ""}`}
            />
          </form>
        </div>
        <div className="flex justify-center rounded-full bg-primary/20 absolute -bottom-10 -right-20 p-4 z-3 animate-pulse">
          <div className="w-40 h-40 rounded-full bg-primary"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
