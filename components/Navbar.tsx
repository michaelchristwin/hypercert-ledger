"use client";

import Link from "next/link";
import Image from "next/image";

function Navbar() {
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
      <div className={`block`}>
        <w3m-button size="sm" />
      </div>
    </nav>
  );
}

export default Navbar;
