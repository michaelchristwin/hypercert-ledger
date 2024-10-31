"use client";

import { motion, AnimatePresence } from "framer-motion";
import HyperCertCard from "@/components/HyperCertCard";
import RoundsData from "@/rounds-data.json";
import { getChain } from "@/actions/hypercerts";

import useStore from "@/context/store";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function Home() {
  const program = useStore((s) => s.program);
  const data = RoundsData.filter((round) => round.program === program);

  if (data.length === 0) {
    return (
      <div className="h-screen w-full flex items-center justify-center px-4">
        <Alert className="max-w-lg">
          <AlertTitle className="text-lg font-semibold">
            No Rounds Found
          </AlertTitle>
          <AlertDescription>
            There are currently no available rounds for this program. Please
            check back later or select a different program.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
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
              bannerImg={data[0].bannerImg}
              logoImg="/logo.webp"
              chain={getChain(data[0].chain_id)}
              seed={data[0].seed}
            />
          </motion.div>
        </AnimatePresence>

        {/* Info section with stagger animation */}
        <motion.div
          className={`col-span-2 lg:h-[380px] md:h-[350px] h-[330px] flex-grow flex-col flex lg:space-y-3 md:space-y-3 morph p-[30px] lg:mx-0 md:mx-0 mx-auto`}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`bg-gradient-to-r from-black via-slate-700 to-gray-500 text-transparent text-center inline-block bg-clip-text lg:text-[3em] md:text-[2.5em] text-[2em] font-extrabold`}
          >
            Mint Your Hypercerts
          </motion.p>
          <div
            className={`w-[95%] block lg:px-7 md:px-4 px-3 lg:text-[1.3em] md:text-[1em] text-[0.6em]`}
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
                  bannerImg={round.bannerImg}
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
