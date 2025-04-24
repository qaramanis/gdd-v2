"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Gamepad2 } from "lucide-react";

export default function GameNotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <Gamepad2 className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">Game Not Found</h2>
      <p className="text-muted-foreground mb-4">
        The game you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Button onClick={() => router.push("/home")}>Back to Home</Button>
    </div>
  );
}
