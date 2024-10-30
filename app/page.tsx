//@ts-nocheck
"use client";

import { use, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HyperCertCard from "@/components/HyperCertCard";
import RoundsData from "@/rounds-data.json";
import { getChain } from "@/actions/hypercerts";
import { useRouter } from "next/navigation";
import useStore from "@/context/store";

function Home(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const program = useStore((s) => s.program);

  const data = RoundsData.filter((round) => round.program === program);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`block h-fit w-full pt-[20px] relative lg:pt-[20px]`}
    >
      <div
        className={`lg:grid md:grid block grid-cols-3 w-full h-fit lg:p-[100px] lg:gap-x-[13%] md:gap-x-[13%] md:p-[60px] p-[20px] space-y-2 mt-[90px]`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={program} // This forces a re-render when program changes
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <HyperCertCard
              name={data[0].name}
              roundId={data[0].round_id}
              bannerImg="/pg1.webp"
              logoImg="/logo.webp"
              chain={getChain(data[0].chain_id)}
              seed={data[0].seed}
            />
          </motion.div>
        </AnimatePresence>

        {/* Info section with stagger animation */}
        <motion.div
          className={`col-span-2 lg:h-[380px] md:h-[350px] h-[330px] flex-grow flex-col flex lg:space-y-1 md:space-y-3 morph p-[10px] lg:mx-0 md:mx-0 mx-auto`}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`bg-gradient-to-r from-black via-slate-700 to-gray-500 text-transparent text-center inline-block bg-clip-text lg:text-[55px] md:text-[45px] text-[25px] font-extrabold`}
          >
            Mint Your Hypercerts
          </motion.p>
          <div
            className={`w-[95%] block lg:p-7 md:p-4 p-3 lg:text-[20px] md:text-[17px] text-[16px]`}
          >
            <p className={``}>
              HyperMinter is a tool for minting a Hypercert to make an onchain
              claim of the impact your project will make with the grant funding
            </p>
            <ul className={`list-disc`}>
              <li>Connect the grant payout wallet</li>
              <li>Click mint on the round you participated in</li>
              <li>
                Modifiy the form that is generated and mint your Hypercert
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Grid section with stagger effect */}
      <motion.div
        className={`w-full flex justify-center items-center lg:py-[60px] py-[40px] md:py-[90px] lg:my-[100px] md:my-[100px] my-[70px]`}
      >
        <div
          className={`grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 w-full gap-x-[3%] gap-y-[20px] lg:px-[100px] md:px-[80px] px-[20px]`}
        >
          <AnimatePresence mode="wait">
            {data.map((round, i) => (
              <motion.div
                key={round.round_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.1, // Stagger effect
                }}
              >
                <HyperCertCard
                  name={round.name}
                  chain={getChain(round.chain_id)}
                  bannerImg="/pg1.webp"
                  logoImg="/logo.webp"
                  roundId={round.round_id}
                  seed={round.seed}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.main>
  );
}

export default Home;
