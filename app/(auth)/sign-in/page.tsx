import SignInForm from "@/components/auth/sign-in-form";
import { Signika } from "next/font/google";

export default function SignInPage() {
  return (
    <div className="bg-black">
      <SignInForm />
    </div>
  );
}
