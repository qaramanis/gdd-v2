import SignInForm from "@/components/auth/sign-in-form";
import { Sign } from "node:crypto";

export default function SignInPage() {
  return (
    <div className="bg-black">
      <div className="w-full max-w-sm">
        <SignInForm />
      </div>
    </div>
  );
}
