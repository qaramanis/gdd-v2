"use client";

import { motion } from "framer-motion";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CheckmarkProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: {
        delay: i * 0.2,
        type: "spring",
        duration: 1.5,
        bounce: 0.2,
        ease: "easeInOut",
      },
      opacity: { delay: i * 0.2, duration: 0.2 },
    },
  }),
};

export function Checkmark({
  size = 100,
  strokeWidth = 2,
  color = "currentColor",
  className = "",
}: CheckmarkProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      initial="hidden"
      animate="visible"
      className={className}
    >
      <title>Animated Checkmark</title>
      <motion.circle
        cx="50"
        cy="50"
        r="40"
        stroke={color}
        variants={draw}
        custom={0}
        style={{
          strokeWidth,
          strokeLinecap: "round",
          fill: "transparent",
        }}
      />
      <motion.path
        d="M30 50L45 65L70 35"
        stroke={color}
        variants={draw}
        custom={1}
        style={{
          strokeWidth,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          fill: "transparent",
        }}
      />
    </motion.svg>
  );
}

export default function DocumentCreated() {
  return (
    <div className="pt-6 flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <Checkmark color="#1E92FF" />
        <motion.div
          className="absolute inset-0 blur-xl bg-[#1E92FF]/10 dark:bg-[#1E92FF]/10 rounded-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: "easeOut",
          }}
        />
      </div>
      <CardHeader className="w-full">
        <CardTitle className="font-medium text-center text-2xl">
          Your game has been created
        </CardTitle>
        <CardDescription className="text-base text-black/60 text-center dark:text-white/60 tracking-tight">
          View and edit your game details
        </CardDescription>
        <CardDescription className="text-base text-black/60 text-center dark:text-white/60 tracking-tight">
          and its documentation from the game page
        </CardDescription>
      </CardHeader>

      <Button asChild className="rounded-full">
        <Link href="/home">View Game Page</Link>
      </Button>
    </div>
  );
}
