"use client";

import Select from "@/components/Select";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useWeb3Modal } from "@web3modal/ethers/react";
import Image from "next/image";
import Round from "./Round";
type RoundValue = {
  roundId: string;
  projectId: string;
};

function Hero() {
  const [value, setValue] = useState<RoundValue>({
    roundId: "",
    projectId: "",
  });
  const { isConnected, chainId, address } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();
  const rounds = [
    {
      value: {
        roundId: "0x0F0b9d9F72C1660905C57864e79CeB409ADa0C9e",
        projectId:
          "0xffd4c2ccb7bd4f5ff975707c418c1073cee2422776dd7b98f77cbad614a9350e",
      },
      label: "Round 1",
    },
    {
      value: {
        roundId: "0x0F0b9d9F72C1660905C57864e79CeB409ADa0C9e",
        projectId:
          "0xffd4c2ccb7bd4f5ff975707c418c1073cee2422776dd7b98f77cbad614a9350e",
      },
      label: "Round 2",
    },
    {
      value: {
        roundId: "0x0F0b9d9F72C1660905C57864e79CeB409ADa0C9e",
        projectId:
          "0xffd4c2ccb7bd4f5ff975707c418c1073cee2422776dd7b98f77cbad614a9350e",
      },
      label: "Round 3",
    },
    {
      value: {
        roundId: "0x0F0b9d9F72C1660905C57864e79CeB409ADa0C9e",
        projectId:
          "0xffd4c2ccb7bd4f5ff975707c418c1073cee2422776dd7b98f77cbad614a9350e",
      },
      label: "Round 4",
    },
  ];
  const handleClick = () => {
    if (!isConnected) {
      open();
    } else {
      router.push(
        `/form?chainId=${chainId}&roundId=${rounds[0].value.roundId}`
      );
    }
  };

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
        <Round name="Round A" image="edited.jpg" />
      </div>
    </div>
  );
}

export default Hero;
