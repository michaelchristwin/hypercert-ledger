"use client";

import Round from "./Round";

function Rounds() {
  return (
    <div
      className={`w-full flex justify-center items-center h-fit py-[90px] mt-[100px]`}
    >
      <div
        className={`grid lg:grid-cols-3 md:grid-cols-3 grid-cols-2 gap-[20px]`}
      >
        <Round
          roundId="0x0F0b9d9F72C1660905C57864e79CeB409ADa0C9e"
          chainId="42161"
          name="Round W"
          image="bg-top.jpg"
        />
        <Round
          roundId="0x0F0b9d9F72C1660905C57864e79CeB409ADa0C9e"
          chainId="42161"
          name="Round X"
          image="edited.jpg"
        />
        <Round
          roundId="0x0F0b9d9F72C1660905C57864e79CeB409ADa0C9e"
          chainId="42161"
          image="sky.jpg"
          name="Round Y"
        />
        <Round
          roundId="0x0F0b9d9F72C1660905C57864e79CeB409ADa0C9e"
          chainId="42161"
          name="Round Z"
          image="sun.jpg"
        />
      </div>
    </div>
  );
}

export default Rounds;
