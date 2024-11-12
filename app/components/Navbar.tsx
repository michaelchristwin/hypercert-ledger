import { Link } from "@remix-run/react";
import { useAppKit, useAppKitState } from "@reown/appkit/react";
import { LoaderCircle } from "lucide-react";
import { useAccount } from "wagmi";

function Navbar() {
  const { open } = useAppKit();
  const { open: isOpen } = useAppKitState();
  const { isConnected } = useAccount();

  return (
    <nav
      className={`flex w-full h-[60px] lg:px-[150px] md:px-[120px] px-[30px] items-center justify-between z-20 fixed top-0 bg-white/10 backdrop-blur-sm bg-opacity-10 mt-[10px]`}
    >
      <Link to={`/`} className={`flex shrink-0 items-center space-x-1.5`}>
        <img
          src={`/brandlogo.webp`}
          alt={`Hyperminter Logo`}
          className="rounded-full w-[22px] h-[22px] sm:w-[26px] sm:h-[26px]
          md:w-[30px] md:h-[30px]"
        />
        <p
          className="lg:inline-block md:inline-block hidden text-[20px] md:text-[25px] lg:text-[28px]
          text-white concert-one text-center whitespace-nowrap"
        >
          <span className={`text-purple-500`}>hyper</span>
          <span className={`text-neutral-700`}>minter</span>
        </p>
      </Link>
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
        {!isConnected ? (
          <button
            type="button"
            onClick={() => open()}
            className={`flex justify-center items-center hover:opacity-[0.8] text-white text-[17px] rounded-[20px] font-semibold w-[150px] lg:h-[38px] md:h-[38px] h-[30px] bg-purple-500`}
          >
            {!isOpen ? (
              "Connect Wallet"
            ) : (
              <>
                Connecting...
                <LoaderCircle className={`animate-spin`} size={15} />
              </>
            )}
          </button>
        ) : (
          <w3m-account-button />
        )}
      </div>
    </nav>
  );
}

export default Navbar;
