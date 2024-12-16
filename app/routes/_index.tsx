import { motion } from "framer-motion";
import { Link } from "@remix-run/react";
import HeroCard from "~/components/cards/HeroCard";

function Index() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`block h-full lg:w-full md:w-full w-fit pt-[80px] lg:py-[20px] md:py-[20px]`}
    >
      <div
        className={`lg:flex md:flex block w-full lg:h-[100vh] md:h-[100vh] h-fit lg:pb-0 md:pb-0 pb-[80px] justify-between items-center space-y-3`}
      >
        {/* Info section with stagger animation */}
        <motion.div
          className={`lg:h-[380px] md:h-[350px] h-[330px] lg:w-[560px] md:w-[500px] w-[350px] rounded-lg flex-col flex bg-white/10 backdrop-blur-sm  lg:mx-0 md:mx-0 mx-auto`}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-purple-500 font-concert-one lg:text-[4.5em] md:text-[3em] text-[2.5em] font-normal`}
          >
            HYPERCERTS FOR GITCOIN GRANTS
          </motion.p>
          <p
            className={`text-neutral-700 block lg:text-[17px] md:text-[16px] text-[15px]`}
          >
            Mint a Hypercert for your Gitcoin grant impact. Make onchain impact
            claims using the Hypercert protocol. Give fractions to your
            community. Sell fractions on the Hypercert marketplace. To get
            started, connect the wallet used to create your Gitcoin grant.
          </p>
          <Link
            to={`/mint`}
            className={`w-fit p-2 rounded-[7px] lg:mx-0 md:mx-0 mx-auto hover:bg-opacity-[0.8] flex justify-center items-center h-fit mt-[40px] text-[25px] bg-purple-500 text-neutral-700 font-concert-one font-normal`}
          >
            CLAIM YOUR IMPACT
          </Link>
        </motion.div>
        <HeroCard />
      </div>
    </motion.main>
  );
}

export default Index;
