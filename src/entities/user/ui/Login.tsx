"use client"
import { useState } from "react";
import { useLogin } from "@/features/user/login/useLogin";

function LoginForm() {
  const { mutate, isLoading } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: any) {
    e.preventDefault();
    alert(`done : email:${email} , password:${password}`)
    mutate({ email, password });
  }

  return (
   <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm">
      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-black text-white py-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : "Login"}
      </button>
    </form>  
);
}

export default LoginForm;
