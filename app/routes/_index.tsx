import type { MetaFunction } from "@vercel/remix";
import { motion, AnimatePresence } from "framer-motion";
import useStore from "~/store";
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
  round_id: number;
  chain_id: number;
  bannerImg: string;
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
  const { year, setYear, props, setProps } = useStore();
  const data = RoundsData.filter((round) => round.program === year);
  const [round, setRound] = useState<RoundData | null>(null);
  useEffect(() => {
    if (props) {
      const rd = JSON.parse(props);
      setRound(rd);
    }
  }, [props]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`block h-fit w-full pt-[20px] relative lg:pt-[20px]`}
    >
      <div
        className={`flex w-full h-fit lg:gap-x-[13%] md:gap-x-[13%] space-y-2 mt-[90px]`}
      >
        {/* Info section with stagger animation */}
        <motion.div
          className={`col-span-2 lg:h-[380px] md:h-[350px] h-[330px] w-[650px] rounded-lg flex-col flex lg:space-y-3 md:space-y-3 bg-white/10 backdrop-blur-sm p-[30px] lg:mx-0 md:mx-0 mx-auto`}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`bg-gradient-to-r from-black via-slate-700 to-gray-500 text-transparent inline-block bg-clip-text lg:text-[2em] md:text-[1.5em] text-[1em] font-extrabold`}
          >
            Mint Your Hypercerts
          </motion.p>
          <div
            className={`w-[95%] block lg:px-7 md:px-4 px-3 lg:text-[1em] md:text-[0.7em] text-[0.5em]`}
          >
            <p className={`italic text-white`}>
              HyperMinter is a tool for minting a Hypercert to make an onchain
              claim of the impact your project will make with the grant funding
            </p>
            <div className={`relative space-y-3`}>
              <div className="absolute left-5 top-12 bg-white/10 backdrop-blur-sm w-0.5 h-8 " />
              <div className={`relative w-[350px] h-[50px] flex items-center`}>
                <Dot
                  className={`absolute left-1 text-white font-extrabold`}
                  size={20}
                  strokeWidth={3}
                />
                <div
                  className={`w-full h-full font-bold text-[17px] flex pl-6 items-center rounded-[6px] bg-white/10 text-white hover:bg-white/20 active:bg-white/30 transition-colors`}
                >
                  Connect the grant payout wallet
                </div>
              </div>
              <div className={`relative w-[350px] h-[50px] flex items-center`}>
                <Select onValueChange={setYear} value={year || ""}>
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
              <div className={`relative w-[350px] h-[50px] flex items-center`}>
                <div className="absolute left-5 -top-4 bg-white/10 backdrop-blur-sm w-0.5 h-8 " />
                <Select value={props} onValueChange={setProps} disabled={!year}>
                  <SelectTrigger className={`w-full z-20`}>
                    <SelectValue placeholder="Select your project" />
                  </SelectTrigger>
                  <SelectContent>
                    {data !== undefined &&
                      data.map((item, i) => (
                        <SelectItem key={i} value={JSON.stringify(item)}>
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
            year={(year && year) || ""}
            name={(round && round.name) || ""}
            roundId={(round && round.round_id) || 0}
            bannerImg={`pg1.webp`}
            logoImg="/logo.webp"
            chain_id={(round && round.chain_id) || 0}
            seed={"45"}
          />
        </div>
      </div>
    </motion.main>
  );
}

export default Index;
