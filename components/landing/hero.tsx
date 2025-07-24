"use client";

import Logo from "@/SVGs/logo";
import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

export default function Hero() {
  return (
    <div className="w-screen h-[92vh] flex flex-col items-center justify-center px-4 select-none ">
      <Logo className="size-64 mb-16" />
      <div className="text-2xl font-bold text-center">
        Game Design Documents in Minutes
      </div>
      <br />
      <div className="text-2xl text-center text-[#666666] mt-4">
        Create, edit and share documents and assets
        <br />
        related to your game with ease
      </div>
      <Button className="text-black bg-white text-base hover:bg-[#cccccc] px-[1rem] py-1 rounded-2xl flex flex-row gap-2 cursor-pointer transition-all duration-300 mt-8">
        Get Started
        <ChevronRight className="w-4" />
      </Button>
    </div>
  );
}
