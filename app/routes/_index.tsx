import { motion } from "framer-motion";
import { useNavigate } from "@remix-run/react";
import HeroCard from "~/components/HeroCard";

function Index() {
  const navigate = useNavigate();
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`block h-full w-full pt-[20px] lg:pt-[20px]`}
    >
      <div
        className={`lg:flex md:flex block w-full h-[100vh] justify-between items-center space-y-3`}
      >
        {/* Info section with stagger animation */}
        <motion.div
          className={`lg:h-[380px] md:h-[350px] h-[330px] lg:w-[500px] md:w-[460px] w-[300px] rounded-lg flex-col flex bg-white/10 backdrop-blur-sm  lg:mx-0 md:mx-0 mx-auto`}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-purple-500 concert-one lg:text-[4.5em] md:text-[3em] text-[2.5em] font-extrabold`}
          >
            MINT YOUR HYPERCERTS
          </motion.p>
          <p
            className={`text-neutral-700 block lg:text-[17px] md:text-[16px] text-[15px]`}
          >
            Mint a Hypercert to make an onchain claim of the impact your project
            will make with the grant funding.
          </p>
          <button
            onClick={() => navigate("/mint")}
            className={`w-[180px] rounded-[7px] hover:bg-opacity-[0.8] flex justify-center items-center h-[50px] mt-[40px] text-[25px] bg-purple-500 text-neutral-700 concert-one`}
          >
            MINT IT NOW
          </button>
        </motion.div>
        <HeroCard />
      </div>
    </motion.main>
  );
}

export default Index;
