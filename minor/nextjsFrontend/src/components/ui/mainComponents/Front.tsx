"use client";
import React from 'react';
import { TypewriterEffectSmoothDemo } from './TypewriterEffectSmoothDemo';
import Image from 'next/image';

type Props = {}

const Front = (props: Props) => {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-[400px]">
      {/* Logo section - takes up 4/10 of total width */}
      <div className="w-full md:w-2/10 p-4 flex items-center justify-center">
        <div className="w-full max-w-xs">
          <Image src="/running.jpg" alt="Logo" width={300} height={400} className="w-full" />
        </div>
      </div>
      
      {/* Content section - takes up 6/10 of total width */}
      <div className="w-full md:w-6/10">
        <TypewriterEffectSmoothDemo />
      </div>
    </div>
  );
}

export default Front;