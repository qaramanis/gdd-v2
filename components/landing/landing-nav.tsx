"use client";
import Logo from "@/SVGs/logo";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function MainNav() {
  return (
    <div className="w-screen h-[8vh] flex items-center justify-between border-b-1 border-[#666666] px-4 select-none">
      <div className="flex items-center py-2 cursor-pointer">
        <Logo className="size-[3rem]" />
        <h1 className="text-2xl font-bold">DoX</h1>
      </div>
      <div className="absolute inset-x-0 max-w-[50vw] mx-auto">
        <div className="flex flex-row gap-[1.5rem] items-center justify-center">
          <Button className="hover:bg-white hover:text-black text-base px-[1rem] rounded-2xl py-1 transition-all duration-300 cursor-pointer">
            About
          </Button>
          <Button className="hover:bg-white hover:text-black text-base px-[1rem] rounded-2xl py-1 transition-all duration-300 cursor-pointer">
            Teams
          </Button>
          <Button className="hover:bg-white hover:text-black text-base px-[1rem] rounded-2xl py-1 transition-all duration-300 cursor-pointer">
            Playground
          </Button>
          <Button className="hover:bg-white hover:text-black text-base px-[1rem] rounded-2xl py-1 transition-all duration-300 cursor-pointer">
            Demo
          </Button>
        </div>
      </div>

      <div className="flex flex-row gap-[2rem] items-center">
        <Button className="hover:bg-white hover:text-black px-[1rem] text-base rounded-2xl py-1 transition-all duration-300 cursor-pointer">
          <Link href="/sign-in">Sign In</Link>
        </Button>
        <Button className="text-black bg-white hover:bg-[#aaaaaa] px-[1rem] text-base rounded-2xl cursor-pointer transition-all duration-300">
          <Link href="/home" className="flex flex-row gap-2">
            Dashboard
            <ChevronRight className="w-4 mt-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
