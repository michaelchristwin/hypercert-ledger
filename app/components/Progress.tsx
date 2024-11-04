import React, { forwardRef } from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { motion } from "framer-motion";
import { Link } from "@remix-run/react";
import { useAccount } from "wagmi";
import { getChain } from "~/actions/hypercerts";

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
    const { chainId } = useAccount();
    const currentChain = getChain(chainId as number);

    if (isMinting) {
      return (
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="relative w-48 h-48">
            {/* Pacman Wrapper */}
            <motion.div className="w-48 h-48 relative">
              {/* Pacman Body */}
              <motion.div className="absolute top-1/2 w-16 h-16 -ml-8 -mt-8 bg-yellow-400 rounded-full">
                {/* Eye */}
                <div
                  className="absolute w-[6px] h-[6px] bg-black rounded-full"
                  style={{
                    top: "10px",
                    left: "55%",
                    transform: "translateX(-50%)",
                  }}
                />
              </motion.div>

              {/* Pacman Mouth - needs to be above the body */}
              <motion.div
                className="absolute top-1/2 w-16 h-16 -ml-8 -mt-8 bg-white"
                style={{
                  transformOrigin: "0% 0%",
                  transform: "translate(50%, 50%) rotate(-20deg)",
                }}
                animate={{
                  clipPath: [
                    "polygon(100% 100%, 100% 0%, 0% 0%)",
                    "polygon(100% 0%, 100% 99%, 0% 0%)",
                  ],
                }}
                transition={{
                  duration: 0.4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "linear",
                }}
              />
            </motion.div>

            {/* Dots */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 mx-3 bg-yellow-400 rounded-full"
                  initial={{ opacity: 1, x: 100 }}
                  animate={{
                    opacity: [1, 0],
                    x: [-20 + i * 40, -60 + i * 40],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "linear",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">
              Minting in Progress
            </h3>
            <p className="text-sm text-gray-600">
              Chomping through the blockchain...
            </p>
          </div>
        </div>
      );
    } else if (!isMinting && isSuccess) {
      return (
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-32 h-32">
            <motion.div
              className="absolute inset-0 bg-green-100 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.svg
              viewBox="0 0 400 400"
              className="absolute inset-0 w-full h-full"
            >
              <motion.circle
                fill="none"
                stroke="#22c55e"
                strokeWidth={24}
                cx={200}
                cy={200}
                r={180}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <motion.path
                fill="none"
                stroke="#22c55e"
                strokeWidth={24}
                d="M 120,200 L 180,260 L 280,140"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              />
            </motion.svg>
          </div>
          <div className="text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <h3 className="text-xl font-semibold text-green-600">
                Transaction Successful!
              </h3>
              <div className="mt-2 text-sm text-gray-600">
                <span>Tx Hash: </span>
                <Link
                  to={`${currentChain.blockExplorers.default.url}/tx/${res.claimsTxHash}`}
                  target="_blank"
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  {`${res.claimsTxHash?.slice(
                    0,
                    15
                  )}...${res.claimsTxHash?.slice(-15)}`}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-32 h-32">
            <motion.div
              className="absolute inset-0 bg-red-100 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.svg
              viewBox="0 0 400 400"
              className="absolute inset-0 w-full h-full"
            >
              <motion.circle
                fill="none"
                stroke="#ef4444"
                strokeWidth={24}
                cx={200}
                cy={200}
                r={180}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8 }}
              />
              <motion.path
                fill="none"
                stroke="#ef4444"
                strokeWidth={24}
                d="M 140,140 L 260,260 M 260,140 L 140,260"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              />
            </motion.svg>
          </div>
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <h3 className="text-xl font-semibold text-red-600">
              Transaction Failed
            </h3>
            <p className="mt-2 text-sm text-gray-600">Please try again</p>
          </motion.div>
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
        <button ref={ref as React.Ref<HTMLButtonElement>}></button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[30]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        </AlertDialog.Overlay>
        <AlertDialog.Content className="fixed z-[31] top-[50%] left-[50%] w-[90%] max-w-[500px] translate-x-[-50%] translate-y-[-50%] bg-white rounded-2xl shadow-2xl p-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className="relative">
              <AlertDialog.Title className="text-2xl font-bold text-gray-800 text-center mb-6">
                {isMinting
                  ? "Processing Hypercert"
                  : isSuccess
                  ? "Success!"
                  : "Error"}
              </AlertDialog.Title>

              {isMinting && (
                <AlertDialog.Description className="text-center text-gray-600 mb-8">
                  Please keep this tab open until completion
                </AlertDialog.Description>
              )}

              {!isMinting && (
                <AlertDialog.Cancel asChild>
                  <button
                    onClick={handleClick}
                    className="absolute right-0 top-0 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </AlertDialog.Cancel>
              )}

              <Monitor />
            </div>
          </motion.div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
});

export default ProgressPopup;
