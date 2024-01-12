"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Round from "./Round";

function Hero() {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const text = "Mint Your HyperCerts";
  const delay = 120;
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return (
    <div className={`flex w-full h-[80vh] items-center justify-around`}>
      <Image
        className={`w-[320px] lg:h-[450px] md:h-[420px] h-[400px] rounded-[30px] shadow`}
        width={320}
        height={450}
        src={`/hyper.webp`}
        alt="hyper"
      />

      <div className={`flex flex-col w-[50%]`}>
        <p
          className={`bg-gradient-to-r from-black via-slate-700 to-gray-500 text-transparent inline-block bg-clip-text text-center text-[60px] font-extrabold `}
        >
          {currentText}
        </p>
        <Round
          name="Round GG19"
          image="edited.jpg"
          roundId="0x0F0b9d9F72C1660905C57864e79CeB409ADa0C9e"
          chainId="42161"
        />
      </div>
    </div>
  );
}

export default Hero;
