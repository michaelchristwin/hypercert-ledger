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
        <Round name="Round W" image="bg-top.jpg" />
        <Round name="Round X" image="edited.jpg" />
        <Round image="sky.jpg" name="Round Y" />
        <Round name="Round Z" image="sun.jpg" />
      </div>
    </div>
  );
}

export default Rounds;
