import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { useNavigate } from "@remix-run/react";
import { Chain } from "viem";
import { useEffect, useState } from "react";
import { impactCertProps } from "~/utils/randomizer/props";
import { Colors } from "~/utils/randomizer/styles/colors";
import { Patterns } from "~/utils/randomizer/styles/patterns";

interface HyperCertCardProps {
  name: string;
  year: string;
  logoImg: string;
  seed: string;
  bannerImg: string;
  roundId: number;
  chain_id: number;
}
function HyperCertCard({
  name,
  bannerImg,
  logoImg,
  roundId,
  year,
  seed,
  chain_id,
}: HyperCertCardProps) {
  const { isConnected } = useAccount();
  const { patternIndex, colorIndex } = impactCertProps(seed);
  const [isClicked, setIsClicked] = useState(false);
  const { open } = useAppKit();
  const navigate = useNavigate();

  const handleClick = async () => {
    setIsClicked(false);
    if (!isConnected) {
      setIsClicked(true);
      open();
    } else if (isConnected) {
      navigate({
        pathname: "/form",
        search: `?chanId=${chain_id}&roundId=${roundId}`,
      });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (isClicked && isConnected && chain_id) {
          navigate({
            pathname: "/form",
            search: `?chanId=${chain_id}&roundId=${roundId}`,
          });

          setIsClicked(false);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [isClicked, isConnected, roundId, chain_id, navigate]);
  return (
    <div
      className={`block min-w-[260px] max-w-[300px] relative w-[330px] h-[400px] rounded-[12px]`}
    >
      <div
        className={`bg-cover bg-center w-[100%] rounded-[12px] h-full`}
        style={{ backgroundImage: `url("${bannerImg}")` }}
      />
      <div
        className={`w-full h-[100%] absolute bottom-[0px] rounded-[12px] p-3`}
        style={{
          background: `linear-gradient(to bottom, rgba(226,188,245,0.25) 15%, ${Colors[colorIndex]} 75%), url("${Patterns[patternIndex]}") center/cover no-repeat`,
        }}
      >
        <div className={`flex justify-start`}>
          <div
            className={`w-[40px] h-[40px] bg-cover rounded-full`}
            style={{ backgroundImage: `url("${logoImg}")` }}
          />
        </div>
        <div
          className={`border-t-2 border-b block border-black min-h-[100px] h-fit mt-[130px]`}
        >
          <p className={`font-[600] text-[20px]`}>
            {year}: {name && <span>{name}</span>}
          </p>
        </div>
        {/* <div className={`flex justify-between w-full pt-2 text-black`}>
          <div className={`block`}>
            <p className={`font-bold text-[13px] text-transparent`}>Work</p>
            <div className={`grid grid-cols-2 gap-2`}></div>
          </div>
          <div className={`flex items-cente`}>
            <p className={`text-[14px] text-transparent`}>work-start</p>
            <p className={`text-[13px] text-transparent space-x-1`}>&rarr;</p>
            <p className={`text-[14px] text-transparent`}>work-end</p>
          </div>
        </div> */}
        <button
          className={`text-black mx-auto bg-white/10 backdrop-blur-sm ${
            !(chain_id && roundId) &&
            "cursor-not-allowed hover:opacity-100 active:opacity-100 hover:border-0 text-transparent"
          } backdrop-filter backdrop-brightness-150 block mt-[40px] w-fit hover:opacity-60 hover:border active:opacity-50 px-2 h-[35px] rounded-lg`}
          type="button"
          disabled={!(chain_id && roundId)}
          onClick={handleClick}
        >
          Mint Hypercert
        </button>
      </div>
    </div>
  );
}

export default HyperCertCard;
