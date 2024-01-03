"use client";

import Select from "@/components/Select";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

function Rounds() {
  const [value, setValue] = useState("");
  const { isConnected } = useWeb3ModalAccount();
  useEffect(() => {
    setIsDisabled(!isConnected);
  }, [isConnected]);
  const [disabled, setIsDisabled] = useState<boolean>(false);
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
  return (
    <div className={`w-full flex justify-center items-center h-[60vh]`}>
      <div
        className={`flex w-[650px] mx-auto justify-center relative space-x-3 px-2 h-fit`}
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
            disabled={disabled}
          />
        </fieldset>
        <button
          onClick={() => router.push(`/form/${value}`)}
          disabled={!value}
          className={`px-2 bg-[#3a59ef] disabled:bg-slate-500 disabled:hover:opacity-100 hover:active:opacity-100 absolute bottom-0 right-0 rounded-[6px] h-[40px]`}
        >
          Proceed
        </button>
      </div>
    </div>
  );
}

export default Rounds;
