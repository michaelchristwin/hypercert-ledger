"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useStore from "@/context/store";

function Navbar() {
  const { setProgram, program } = useStore();

  const updateYear = (program: string) => {
    setProgram(program);
  };

  return (
    <nav
      className={`flex w-full h-[90px] lg:px-9 md:px-7 px-2 items-center justify-between z-20 fixed top-0 shadow bg-[#ffffff] backdrop-filter backdrop-blur-[20px] bg-opacity-10`}
    >
      <Link href={`/`} className={`flex w-fit items-center space-x-1`}>
        <Image
          src={`/brandlogo.webp`}
          alt="Hyperminter logo"
          width={30}
          height={30}
          className={`rounded-full w-[30px] h-[30px]`}
        />
        <p
          className={`lg:text-[23px] md:text-[22px] text-[19px] font-bold bg-gradient-to-r from-[#3d8b8d] to-[rgba(252,0,255)] text-transparent text-center inline-block bg-clip-text `}
        >
          HYPERMINTER
        </p>
      </Link>
      <div className={`flex justify-center space-x-2`}>
        <Select value={program || "GG20"} onValueChange={updateYear}>
          <SelectTrigger
            className={`w-[180px] bg-white bg-opacity-10 backdrop-blur-sm text-white focus:ring-white focus:ring-2 border border-white border-opacity-20 focus:ring-opacity-30 hover:bg-opacity-15 transition-all`}
            aria-label="Year"
            aria-labelledby=""
          >
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GG20">2020</SelectItem>
            <SelectItem value="GG21">2021</SelectItem>
            <SelectItem value="GG22">2022</SelectItem>
          </SelectContent>
        </Select>
        {/*@ts-ignore */}
        <w3m-button />
      </div>
    </nav>
  );
}

export default Navbar;
