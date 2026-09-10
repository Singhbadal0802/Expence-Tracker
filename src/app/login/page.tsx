"use client"
import Button from "@/components/UI/Button";
import React, { useState } from "react";
import { LoaderCircle  } from 'lucide-react';

const Login = () => {
    const [stateValue, setStateValue] = useState<"login" | "register">("register");
    const [loginEmailValue, setLoginEmailValue] = useState<string>('');
    const [loginPassword, setLoginPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleLonginSubmit = async() =>{
      if(loginEmailValue && loginPassword){
        setIsLoading(true);
        try{
        let payload = {
          "email" : loginEmailValue,
          "password" : loginPassword
        }

        const response = await fetch('https://singhbadal0802-x1py.vercel.app/api/auth/login',
          {
            method : 'POST',
            headers : {
              'Content-Type' : 'application/json'
            },
            body : JSON.stringify(payload)
          }
        )

        const data = await response.json();

        if(data && data.token && data.user){
          const timer = setTimeout(()=>{
          setIsLoading(false);
          sessionStorage.setItem('userDetails', JSON.stringify(data.user));
          debugger;
          window.location.href = "/";
          },2000);
        }
      }catch(error){
        console.log('❌ Error fetching user details : ', error);
      }finally{
        const timer = setTimeout(()=>{
          setIsLoading(false);
          },2000);

          return () => clearTimeout(timer);
      }
      }
    }

  return (
    <div className="flex w-full justify-center items-center h-[100vh] bg-light inset-shadow-white">
      <div className="relative grid grid-cols-2 w-[70%] h-[70%] rounded-lg z-2 overflow-hidden transition-all delay-400 duration-600 ease-in-out border border-1 border-primary/50 px-2 backdrop-blur-sm">
        <div className={`w-[50%] h-[800px] bg-white absolute -top-20 ${stateValue === "login" ? "-left-25 -rotate-20" : "left-[625px] rotate-20"} z-1 transition-all duration-600 ease-in-out`}>
        <div className={"flex flex-col justify-center items-center w-full h-full bg-primary/30 rounded-lg"}>
            <div className={`text-not-convertable text-heading1 font-bold m-4 transition-all ${stateValue === "login" ? "rotate-20 text-left ml-40" : "-rotate-20 text-right mr-40"} transition-all duration-600 ease-in-out`}>{stateValue === "login" ? "If already with us, Click here" : "New here..? click to join us"}</div>
            <Button buttonLabel={stateValue === "register" ? "Signup" : "Login"} variant="brand-primary" tone="primary" onClick={()=>{setStateValue(stateValue === "login" ? "register" : "login")}} customClass={`${stateValue === "login" ? "rotate-20" : "-rotate-20"} transition-all duration-600 ease-in-out text-opposite`}/>
        </div>
        </div>
        <div className="flex flex-col justify-center items-center m-auto gap-8">
            {/* <input className="rounded-lg border border-1 border-primary px-2 py-4 bg-gray-100" type="name" placeholder="name"/> */}
            <input className="text-not-convertable rounded-lg border border-1 border-primary p-2 bg-gray-100" type="email" placeholder="abc@gmail.com" onChange={(e)=>{setLoginEmailValue(e.target.value)}}/>
            <input className="text-not-convertable rounded-lg border border-1 border-primary p-2 bg-gray-100" type="password" placeholder="password"  onChange={(e)=>{setLoginPassword(e.target.value)}}/>
            <Button variant="brand-primary" tone="success" buttonLabel="Login" onClick={handleLonginSubmit} customClass="flex w-full justify-center text-lg" isLoading={isLoading}/>
        </div>
        <div className="flex justify-center items-center m-auto">
        <form className="flex flex-col justify-center items-center m-auto gap-8">
            <input className="text-not-convertable rounded-lg border border-1 border-primary p-2 bg-gray-100" type="name" placeholder="name"/>
            <input className="text-not-convertable rounded-lg border border-1 border-primary p-2 bg-gray-100" type="email" placeholder="abc@gmail.com"/>
            <input className="text-not-convertable rounded-lg border border-1 border-primary p-2 bg-gray-100" type="password" placeholder="password"/>
            <Button variant="brand-primary" tone="success" buttonLabel="Signup" onClick={()=>{}} customClass="w-full"/>
        </form>
        </div>
      </div>
    </div>
  );
};

export default Login;