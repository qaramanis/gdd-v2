// components/dashboard/home/home.tsx
"use client";

import React from "react";
import { ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import TiltedCard from "@/components/tilted-card";
import { useRouter } from "next/navigation";
import QuickActions from "./quick-actions";
import RecentActivity from "./recent-activity";
import { Component as PieChart } from "@/components/charts/pie-chart";
import { Component as BarChart } from "@/components/charts/bar-chart-mixed";
import { Separator } from "@/components/ui/separator";

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

  return (
    <div className="flex flex-col gap-6 p-4 pt-0">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Your Games</h2>
          <Button
            variant="ghost"
            className="flex items-center gap-2 rounded-full dark:hover:bg-sky-600/80"
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
              scaleOnHover={1}
              containerWidth="auto"
              imageWidth="100%"
              displayOverlayContent={true}
              overlayContent={game.title}
              showMobileWarning={false}
            />
          ))}
        </div>
      </div>
      {/* <Separator className="bg-black/20 dark:bg-white/20" /> */}
      <Separator className="bg-primary/10 dark:bg-gray-400/20 m-2" />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-auto md:flex-1 flex flex-col gap-6">
          <RecentActivity />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PieChart />
            <BarChart />
          </div>
        </div>
        <QuickActions />
      </div>
    </div>
  );
}
