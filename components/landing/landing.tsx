import React from "react";
import Hero from "./hero";
import MainNav from "./landing-nav";

export default function Landing() {
  return (
    <div className="relative justify-center">
      <div className="z-2">
        <MainNav />
      </div>
      <div className="absolute z-2">
        <Hero />
      </div>
    </div>
  );
}
