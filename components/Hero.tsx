"use client";

import Select from "@/components/Select";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import Image from "next/image";

function Hero() {
  const [value, setValue] = useState("");
  const { isConnected } = useWeb3ModalAccount();

  const rounds = [
    { value: "1", label: "Round 1" },
    { value: "2", label: "Round 2" },
    { value: "3", label: "Round 3" },
    { value: "4", label: "Round 4" },
  ];
  const handleChange = (selectedOption: any) => {
    setValue(selectedOption.value);
  };
  const router = useRouter();
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
    <div className={`flex w-full items-center justify-around`}>
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
        <div
          className={`flex w-[650px]  justify-center relative space-x-3 px-2 h-fit`}
        >
          <fieldset className={`w-[70%]`}>
            <label
              htmlFor="rounds"
              className={`font-bold text-[18px] block mb-1 text-slate-400`}
            >
              Name of the round
            </label>
            <Select
              id="rounds"
              handleChange={handleChange}
              placeholder={`Select...`}
              options={rounds}
              disabled={false}
            />
          </fieldset>
          <button
            onClick={() =>
              router.push(`/form?roundId=${value}&projectId=${value}`)
            }
            disabled={!value}
            className={`px-2 bg-[#3a59ef] text-white disabled:hover:opacity-100 hover:active:opacity-100 absolute bottom-0 right-0 rounded-[6px] h-[40px]`}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
