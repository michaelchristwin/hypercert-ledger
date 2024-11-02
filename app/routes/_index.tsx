import type { MetaFunction } from "@vercel/remix";
import { motion, AnimatePresence } from "framer-motion";
import RoundsData from "~/rounds-data.json";
import HyperCertCard from "~/components/HypercertCard";
import { Dot } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useEffect, useState } from "react";

interface RoundData {
  program: string;
  name: string;
  round_id: number | undefined;
  chain_id: number | undefined;
  seed: string;
}

export const meta: MetaFunction = () => {
  return [
    { title: "Hyperminter" },
    {
      name: "description",
      content: "A tool for minting project based Hypercerts onchain.",
    },
  ];
};

function Index() {
  const [round, setRound] = useState<RoundData>({
    program: "",
    name: "",
    round_id: undefined,
    chain_id: undefined,
    seed: "",
  });
  const { program, name, chain_id, round_id } = round;
  const data = RoundsData.filter((r) => r.program === program);

  const onYearChange = (value: string) => {
    setRound((p) => ({ ...p, program: value }));
  };
  const onRoundChange = (value: string) => {
    const round = data.find((item) => item.name === value);
    if (round) {
      setRound(round);
    }
  };
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`block h-fit w-full pt-[20px] relative lg:pt-[20px]`}
    >
      <div
        className={`lg:flex md:flex block w-full h-fit lg:gap-x-[13%] md:gap-x-[13%] space-y-3 lg:mt-[90px] md:mt-[90px] mt-[60px]`}
      >
        {/* Info section with stagger animation */}
        <motion.div
          className={`lg:h-[380px] md:h-[350px] h-[330px] lg:w-[650px] md:w-[500px] w-[300px] rounded-lg flex-col flex lg:space-y-3 md:space-y-3 bg-white/10 backdrop-blur-sm lg:p-[30px] md:p-[25px] p-[10px] lg:mx-0 md:mx-0 mx-auto`}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`bg-gradient-to-r from-black via-slate-700 to-gray-500 text-transparent inline-block bg-clip-text lg:text-[2em] md:pl-4 pl-2 md:text-[1.5em] text-[1em] font-extrabold`}
          >
            Mint Your Hypercerts
          </motion.p>
          <div className={`w-[95%] block lg:px-7 space-y-2 md:px-4 px-2`}>
            <p
              className={`italic text-white lg:text-[1em] md:text-[1em] text-[0.8em]`}
            >
              HyperMinter is a tool for minting a Hypercert to make an onchain
              claim of the impact your project will make with the grant funding
            </p>
            <div className={`relative space-y-3`}>
              <div
                className={`relative lg:w-[350px] md:w-[350px] w-[270px] h-[50px] flex items-center`}
              >
                <Dot
                  className={`absolute left-1 text-gray-400 font-extrabold`}
                  size={20}
                  strokeWidth={3}
                />
                <div
                  className={`w-full h-full font-bold lg:text-[17px] md:text-[17px] text-[15px] flex pl-6 items-center rounded-[6px] bg-white/10 text-gray-400 transition-colors`}
                >
                  Connect the grant payout wallet
                </div>
              </div>
              <div
                className={`relative lg:w-[350px] md:w-[350px] w-[270px] h-[50px] flex items-center`}
              >
                <Select onValueChange={onYearChange} value={program}>
                  <SelectTrigger className={`w-full z-20`}>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GG22">2022</SelectItem>
                    <SelectItem value="GG21">2021</SelectItem>
                    <SelectItem value="GG20">2020</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div
                className={`relative lg:w-[350px] md:w-[350px] w-[270px] h-[50px] flex items-center`}
              >
                <div className="absolute left-5 -top-4 bg-white/10 backdrop-blur-sm w-0.5 h-8 " />
                <Select
                  value={name}
                  onValueChange={onRoundChange}
                  disabled={!program}
                >
                  <SelectTrigger
                    className={`w-full z-20 ${
                      !program ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select your project" />
                  </SelectTrigger>
                  <SelectContent>
                    {data !== undefined &&
                      data.map((item, i) => (
                        <SelectItem key={i} value={item.name}>
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* <ul className={`list-disc`}>
              <li>Connect the grant payout wallet</li>
              <li>Click mint on the round you participated in</li>
              <li>
                Modifiy the form that is generated and mint your Hypercert
              </li>
            </ul> */}
          </div>
        </motion.div>
        <div>
          <HyperCertCard
            year={program}
            name={name}
            roundId={round_id || 0}
            bannerImg={`pg1.webp`}
            logoImg="/logo.webp"
            chain_id={chain_id || 0}
            seed={"45"}
          />
        </div>
      </div>
    </motion.main>
  );
}

export default Index;
