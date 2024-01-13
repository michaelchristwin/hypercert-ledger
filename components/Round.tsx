import { useWeb3Modal, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useRouter } from "next/navigation";
import { Chain } from "viem";

interface RoundProps {
  name: string;
  image: string;
  details?: string;
  chainId: string;
  roundId?: string;
  chain: Chain;
}
function Round({ name, image, roundId, chainId, chain }: RoundProps) {
  const { isConnected } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();

  const router = useRouter();

  const handleClick = () => {
    if (!isConnected) {
      open();
    } else {
      router.push(`/form?chainId=${chain.id}&roundId=${roundId}`);
    }
  };

  return (
    <div className={`rounded-[12px] mx-auto shadow h-[380px] w-[350px]`}>
      <div
        className={`h-[40%] p-4 rounded-t-[12px] bg-cover bg-center object-cover backdrop-brightness-[40%] backdrop-blur-md backdrop-filter`}
        style={{
          background: `linear-gradient(to bottom, rgb(0,0,0,0.5) 0%, rgb(0,0,0,0.5) 100%), url("/${image}")`,
          backgroundSize: "cover",
        }}
      >
        <div className={`flex w-full justify-between`}>
          <div className={`block w-[50%]`}>
            <p className={`font-bold text-[23px] text-white`}>{name}</p>
          </div>
          <button
            onClick={handleClick}
            className={`text-black bg-white hover:opacity-75 active:opacity-60 text-[11px] rounded-[7px] h-[21px] w-fit px-2`}
          >
            Mint HyperCert
          </button>
        </div>
      </div>
      <div className={`h-[60%] bg-white rounded-b-[12px] p-5`}>
        <p>
          <b>Lorem ipsum:</b> dolor sit amet consectetur adipisicing elit.
          Ipsum, doloribus nihil nam ea at suscipit magnam. Impedit, tempore
          culpa eveniet molestiae nesciunt, numquam dignissimos provident cum
          labore soluta deserunt libero?
        </p>
      </div>
    </div>
  );
}

export default Round;
