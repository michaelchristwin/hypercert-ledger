import { Link } from "@remix-run/react";
import { useAppKit } from "@reown/appkit/react";
import { useAppKitState } from "@reown/appkit/react";
import { LoaderCircle } from "lucide-react";
import { useAccount } from "wagmi";

function Navbar() {
  const { open } = useAppKit();
  const { open: isOpen } = useAppKitState();
  const { isConnected } = useAccount();

  return (
    <nav
      className={`flex w-full h-[60px] px-2 sm:px-4 md:px-7 
      lg:px-9 items-center justify-between z-20 fixed top-0 shadow bg-white/10 backdrop-blur-sm bg-opacity-10`}
    >
      <Link to={`/`} className={`flex shrink-0 items-center space-x-1.5`}>
        <img
          src={`/brandlogo.webp`}
          alt={`Hyperminter Logo`}
          className="rounded-full w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] 
          md:w-[30px] md:h-[30px]"
        />
        <p
          className="text-[13px] lg:inline-block md:inline-block hidden sm:text-[16px] md:text-[20px] lg:text-[23px] 
          font-semibold text-white text-center whitespace-nowrap"
        >
          Hyperminter
        </p>
      </Link>
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
        {!isConnected ? (
          <button
            type="button"
            onClick={() => open()}
            className={`w-fit flex justify-center items-center hover:opacity-[0.8] text-black rounded-[8px] font-semibold lg:p-2 md:p-2 p-[6px] lg:h-[38px] md:h-[38px] h-[35px] bg-white`}
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
