"use client";
import HyperCertCard from "@/components/HyperCertCard";
import { ProjectChains } from "@/config";

function Home() {
  const { arbitrum, optimism } = ProjectChains;
  return (
    <main className={`block h-fit w-full pt-[20px] relative lg:pt-[20px]`}>
      <div
        className={`lg:grid md:grid block grid-cols-3 w-full h-fit lg:p-[100px] lg:gap-x-[13%] md:gap-x-[13%] md:p-[60px] p-[20px] space-y-2 mt-[90px]`}
      >
        <HyperCertCard
          name="GG20: Climate"
          roundId={29}
          bannerImg="/pg1.webp"
          logoImg="/logo.webp"
          chain={arbitrum}
          seed="29"
        />

        <div
          className={`col-span-2 flex-grow flex-col flex space-y-4 morph p-[10px] lg:mx-0 md:mx-0 mx-auto`}
        >
          <p
            className={`bg-gradient-to-r from-black via-slate-700 to-gray-500 text-transparent text-center inline-block bg-clip-text lg:text-[55px] md:text-[50px] text-[25px] font-extrabold `}
          >
            Mint Your Hypercerts
          </p>
          <div className={`w-[95%] block lg:p-6 md:p-4 p-3 text-[20px]`}>
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
        </div>
      </div>
      <div
        className={`w-full flex justify-center items-center lg:py-[60px] py-[40px] md:py-[90px] lg:my-[100px] md:my-[100px] my-[70px]`}
      >
        <div
          className={`grid lg:grid-cols-4 md:grid-cols-3 grid-cols-1 w-full gap-x-[3%] gap-y-[20px] lg:px-[100px] md:px-[100px] px-[20px]`}
        >
          <HyperCertCard
            roundId={29}
            name="GG20: Climate"
            bannerImg="/pg1.webp"
            logoImg="/logo.webp"
            chain={arbitrum}
            seed="29"
          />

          <HyperCertCard
            roundId={23}
            bannerImg="/pg3.webp"
            logoImg="/logo.webp"
            name="GG20: Hackathon Alumini"
            seed="23"
            chain={arbitrum}
          />
          <HyperCertCard
            roundId={25}
            name="GG20: dApps and Apps"
            bannerImg="/pg5.webp"
            logoImg="/logo.webp"
            chain={arbitrum}
            seed="25"
          />
          <HyperCertCard
            roundId={28}
            name="GG20: Hypercerts Ecosystem"
            bannerImg="/pg5.webp"
            logoImg="/logo.webp"
            chain={arbitrum}
            seed="28"
          />
          <HyperCertCard
            roundId={31}
            name="GG20: Open Civics"
            bannerImg="/pg5.webp"
            logoImg="/logo.webp"
            chain={arbitrum}
            seed="31"
          />
          <HyperCertCard
            roundId={26}
            name="GG20: Web3 Infra"
            logoImg="/logo.webp"
            bannerImg="/pg2.webp"
            chain={arbitrum}
            seed="26"
          />
          <HyperCertCard
            name="GG20: Developer Tooling"
            roundId={27}
            logoImg="/logo.webp"
            bannerImg="/pg4.webp"
            seed="27"
            chain={arbitrum}
          />
          <HyperCertCard
            name="GG20: ENS"
            roundId={24}
            logoImg="/logo.webp"
            bannerImg="/pg5.webp"
            seed="24"
            chain={arbitrum}
          />
          <HyperCertCard
            name="GG20: TEC"
            roundId={9}
            logoImg="/logo.webp"
            bannerImg="/pg2.webp"
            seed="9"
            chain={optimism}
          />
        </div>
      </div>
    </main>
  );
}

export default Home;
