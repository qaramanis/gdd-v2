// components/auth/auth-test.tsx
"use client";

import { useState } from "react";
import { signUp, signIn } from "@/lib/auth-client";

export default function AuthTest() {
  const [result, setResult] = useState<string>("");

  const testSignUp = async () => {
    try {
      console.log("Testing sign up...");
      const result = await signUp.email({
        email: "test@example.com",
        password: "testpassword123",
        name: "Test User",
      });
      console.log("Sign up test result:", result);
      setResult(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("Sign up test error:", error);
      setResult(`Error: ${error}`);
    }
  };

  return (
    <div className="p-4">
      <h2>Auth Test</h2>
      <button
        onClick={testSignUp}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Test Sign Up
      </button>
      <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">{result}</pre>
    </div>
  );
}
