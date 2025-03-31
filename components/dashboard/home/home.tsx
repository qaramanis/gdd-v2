"use client";

import React from "react";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TiltedCard from "@/components/tilted-card";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // Get a subset of games from the same data used in view-all.tsx
  const featuredGames = [
    {
      id: 2,
      title: "Bioshock 2",
      image:
        "https://image.api.playstation.com/vulcan/img/cfn/11307iHrR0st30ikbq2Ed2zG2gSIk6YJQoUUl0BDPNWTaFNcAXnCbaZVojki47m1NwHMw42vdb-xdEJDyqAcfXsbsGU6P7a1.png",
    },
    {
      id: 6,
      title: "The Witcher 3: Wild Hunt",
      image:
        "https://image.api.playstation.com/vulcan/ap/rnd/202211/0711/kh4MUIuMmHlktOHar3lVl6rY.png",
    },
    {
      id: 8,
      title: "Elden Ring",
      image:
        "https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/phvVT0qZfcRms5qDAk0SI3CM.png",
    },
    {
      id: 10,
      title: "Horizon Forbidden West",
      image:
        "https://image.api.playstation.com/vulcan/ap/rnd/202107/3100/HO8vkO9pfXhwbHi5WHECQJdN.png",
    },
  ];

  const renderSimpleOverlay = (title: string) => (
    <div className="w-full h-full flex items-start">
      <div className="bg-black/80 text-white dark:bg-white/80 dark:text-black px-3 py-2 rounded-lg mx-6 my-5 max-w-full">
        {title}
      </div>
    </div>
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Games</h2>
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => router.push("/dashboard/view-all")}
          >
            View all <ArrowRightIcon className="size-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 select-none">
          {featuredGames.map((game) => (
            <TiltedCard
              key={game.id}
              imageSrc={game.image}
              altText={game.title}
              captionText={game.title}
              showTooltip={true}
              scaleOnHover={1.05}
              containerWidth="auto"
              imageWidth="100%"
              displayOverlayContent={true}
              overlayContent={renderSimpleOverlay(game.title)}
              showMobileWarning={false}
            />
          ))}
        </div>
      </div>

      <div className="bg-primary/5 p-6 rounded-lg mt-4">
        <h2 className="text-xl font-bold mb-3">Recent Activity</h2>
        <div className="space-y-2">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-md flex justify-between items-center">
            <div>
              <p className="font-medium">Elden Ring</p>
              <p className="text-sm text-gray-500">Updated 2 hours ago</p>
            </div>
            <Button variant="ghost" size="sm">
              Open
            </Button>
          </div>
          <div className="p-3 bg-white dark:bg-gray-800 rounded-md flex justify-between items-center">
            <div>
              <p className="font-medium">Horizon Forbidden West</p>
              <p className="text-sm text-gray-500">Updated yesterday</p>
            </div>
            <Button variant="ghost" size="sm">
              Open
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
