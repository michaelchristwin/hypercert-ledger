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
      className="flex w-full h-[60px] sm:h-[70px] md:h-[90px] px-2 sm:px-4 md:px-7 
      lg:px-9 items-center justify-between z-20 fixed top-0 shadow bg-[#ffffff] 
      backdrop-filter backdrop-blur-[20px] bg-opacity-10"
    >
      <Link href="/" className="flex shrink-0 items-center space-x-1.5">
        <Image
          src="/brandlogo.webp"
          alt="Hyperminter logo"
          width={22}
          height={22}
          className="rounded-full w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] 
          md:w-[30px] md:h-[30px]"
        />
        <p
          className="text-[13px] lg:inline-block md:inline-block hidden sm:text-[16px] md:text-[20px] lg:text-[23px] 
          font-bold bg-gradient-to-r from-[#3d8b8d] to-[rgba(252,0,255)] 
          text-transparent text-center bg-clip-text whitespace-nowrap"
        >
          HYPERMINTER
        </p>
      </Link>

      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
        <Select value={program || "GG20"} onValueChange={updateYear}>
          <SelectTrigger
            className="w-[80px] sm:w-[120px] md:w-[180px] h-[32px] sm:h-[36px] 
            md:h-[40px] text-xs sm:text-sm md:text-base px-2 sm:px-3
            bg-white bg-opacity-10 backdrop-blur-sm text-white 
            focus:ring-white focus:ring-2 border border-white border-opacity-20 
            focus:ring-opacity-30 hover:bg-opacity-15 transition-all"
            aria-label="Year"
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
        <w3m-button size="sm" />
      </div>
    </nav>
  );
}

export default Navbar;
