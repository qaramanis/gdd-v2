"use client";

import Playground from "@/components/playground/playground-page";
import { Suspense } from "react";

export default function PlaygroundPage() {
  return (
    <Suspense fallback={<div>Loading playground...</div>}>
      <Playground />
    </Suspense>
  );
}
