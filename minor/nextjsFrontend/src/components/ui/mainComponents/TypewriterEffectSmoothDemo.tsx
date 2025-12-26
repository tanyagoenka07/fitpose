"use client";

import Link from "next/link";
import { TypewriterEffectSmooth } from "../typewriter-effect";

export function TypewriterEffectSmoothDemo() {
    const words = [
        { text: "Move." },
        { text: "Correct." },
        { text: "Improve." },
        { text: "with" },
        { text: "AI Precision.", className: "text-blue-500 dark:text-blue-500" },
      ];      
  return (
    <div className="flex flex-col items-center justify-center h-[40rem]  ">
     <p className="text-neutral-800 text-lg">
     Train smarter, prevent injuries, and improve faster. 
     </p>
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <Link href={"/signup"}>
        <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm cursor-pointer transition-transform hover:scale-110 duration-300">
          Sign Up
        </button>
        </Link>
        <Link href={"/dashboard"}>
        <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm cursor-pointer hover:bg-gray-200 transition-transform hover:scale-110 duration-300">
          Get Started
        </button>
        </Link>
      </div>
    </div>
  );
}
