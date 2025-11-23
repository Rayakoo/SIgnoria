"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FAFAFA]">
      <DotLottieReact
        src="/Hand Loding.lottie"
        loop
        autoplay
        style={{ width: 300, height: 300 }} 
      />
    </div>
  );
}
