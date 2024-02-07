"use client";

import { getChain } from "@/actions/hypercerts";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import Link from "next/link";

import { forwardRef } from "react";
export type MethRes = {
  allowlistTxHash: `0x${string}` | undefined;
  claimsTxHash: `0x${string}` | undefined;
};

interface ProgressProps {
  res: MethRes;
  isSuccess: boolean;
  isMinting: boolean;
}

const ProgressPopup = forwardRef(function ProgressPopup(
  props: ProgressProps,
  ref
) {
  const { res, isSuccess, isMinting } = props;

  const Monitor = () => {
    const { chainId } = useWeb3ModalAccount();
    const currentChain = getChain(chainId as number);

    if (isMinting) {
      return (
        <div className="loader">
          <div className="circles">
            <span className="one"></span>
            <span className="two"></span>
            <span className="three"></span>
          </div>
          <div className="pacman">
            <span className="top"></span>
            <span className="bottom"></span>
            <span className="left"></span>
            <div className="eye"></div>
          </div>
        </div>
      );
    } else if (!isMinting && isSuccess) {
      return (
        <div className={`w-full items-center space-y-2 h-[70%]`}>
          <div
            className={`w-[140px] mx-auto flex animate-animateContainer justify-center items-center h-[140px] bg-green-600 rounded-full`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M4 12.6111L8.92308 17.5L20 6.5"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
          </div>
          <p className={`text-[18px] text-green-600`}>
            Transaction Successful!
          </p>
          <pre className={`block text-[16px]`}>
            Tx Hash:
            <Link
              target={`_blank`}
              href={`${currentChain.blockExplorers.default.url}/tx/${res.allowlistTxHash}`}
              className={`text-sky-500`}
            >{` ${res.allowlistTxHash?.slice(
              0,
              15
            )}...${res.allowlistTxHash?.slice(-15)}`}</Link>
          </pre>
        </div>
      );
    } else {
      return (
        <div className={`w-full flex justify-center items-center h-[70%]`}>
          <div
            className={`w-[140px] flex animate-animateContainer justify-center items-center h-[140px] bg-red-600 rounded-full`}
          >
            <svg
              fill="#ffffff"
              height="70px"
              width="70px"
              version="1.1"
              id="Capa_1"
              className={`animate-animateCheck`}
              xmlns="http://www.w3.org/2000/svg"
              xmlSpace="preserve"
              viewBox="0 0 460.775 460.775"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path>
              </g>
            </svg>
          </div>
        </div>
      );
    }
  };
  const handleClick = () => {
    if (isSuccess) {
      window.location.assign("/");
    }
  };
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button ref={ref as React.LegacyRef<HTMLButtonElement>}></button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed bg-neutral-900/90 inset-0 backdrop-blur z-[30]" />
        <AlertDialog.Content className="fixed focus:outline-none drop-shadow-md border z-[31] border-neutral-700 top-[50%] left-[50%] h-[300px] lg:w-[38%] md:w-[38%] w-[90%] translate-y-[-50%] translate-x-[-50%] rounded-md bg-white p-[2%]">
          <AlertDialog.Title
            className={`block lg:text-[25px] md:text-[20px] text-[19px] font-bold`}
          >
            Processing Hypercert
          </AlertDialog.Title>
          {isMinting && (
            <AlertDialog.Description
              className={`block lg:text-[16px] md:text-[17px] text-[16px] text-neutral-700`}
            >
              Please keep this tab open until completion
            </AlertDialog.Description>
          )}
          {!isMinting && (
            <AlertDialog.Cancel asChild>
              <button
                className={`w-[25px] h-[25px]  absolute flex justify-center items-center right-2 top-2 rounded-full bg-black`}
                onClick={handleClick}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                >
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="#ffffff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </AlertDialog.Cancel>
          )}
          <Monitor />
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
});

export default ProgressPopup;
