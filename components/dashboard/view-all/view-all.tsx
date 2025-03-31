"use client";

import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TiltedCard from "@/components/tilted-card";

export default function ViewAll() {
  const documents = [
    {
      id: 1,
      title: "Grand Theft Auto V",
      image:
        "https://image.api.playstation.com/vulcan/ap/rnd/202101/2019/JdvqcPlTYMxXrA1QQJm6TbDX.png",
    },
    {
      id: 2,
      title: "Bioshock 2",
      image:
        "https://image.api.playstation.com/vulcan/img/cfn/11307iHrR0st30ikbq2Ed2zG2gSIk6YJQoUUl0BDPNWTaFNcAXnCbaZVojki47m1NwHMw42vdb-xdEJDyqAcfXsbsGU6P7a1.png",
    },
    {
      id: 3,
      title: "Civilization 6",
      image:
        "https://image.api.playstation.com/vulcan/ap/rnd/202107/0117/b79fQ20GVAQjRF9fAPVd7TsF.png",
    },
    {
      id: 4,
      title: "Rust",
      image:
        "https://image.api.playstation.com/vulcan/ap/rnd/202103/1501/enihR6QwSYiWCNl2HdPfV6R6.png",
    },
    {
      id: 5,
      title: "Cities Skylines",
      image:
        "https://image.api.playstation.com/vulcan/img/rnd/202009/3007/n0VP0Z8M5gB93kWKt7Zz2Wrw.png",
    },
    {
      id: 6,
      title: "The Witcher 3: Wild Hunt",
      image:
        "https://image.api.playstation.com/vulcan/ap/rnd/202211/0711/kh4MUIuMmHlktOHar3lVl6rY.png",
    },
    {
      id: 7,
      title: "Red Dead Redemption 2",
      image:
        "https://image.api.playstation.com/cdn/UP1004/CUSA03041_00/Hpl5MtwQgOVF9vJqlfui6SDB5Jl4oBSq.png",
    },
    {
      id: 8,
      title: "Elden Ring",
      image:
        "https://image.api.playstation.com/vulcan/ap/rnd/202110/2000/phvVT0qZfcRms5qDAk0SI3CM.png",
    },
    {
      id: 9,
      title: "Cyberpunk 2077",
      image:
        "https://image.api.playstation.com/vulcan/ap/rnd/202306/0116/e22efe5995a1271bc407b45e7d4a1b64bb3d9adae88b1887.png",
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
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Documents</h1>
        <Button
          variant="ghost"
          className={cn(
            "w-auto rounded-full justify-between m-2 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:justify-center transition-all cursor-pointer",
            "bg-black hover:bg-black/80",
            "dark:bg-white dark:hover:bg-white text-white",
            "[&>svg]:text-white dark:[&>svg]:text-black"
          )}
        >
          <Plus className="size-4" />
          <span className="flex text-white dark:text-black items-center group-data-[collapsible=icon]:hidden">
            <span>New Document</span>
          </span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 select-none">
        {documents.map((doc) => (
          <TiltedCard
            key={doc.id}
            imageSrc={doc.image}
            altText={doc.title}
            captionText={doc.title}
            showTooltip={true}
            scaleOnHover={1.05}
            containerWidth="auto"
            imageWidth="100%"
            displayOverlayContent={true}
            overlayContent={renderSimpleOverlay(doc.title)}
            showMobileWarning={false}
          />
        ))}
      </div>
    </div>
  );
}
