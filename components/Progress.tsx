import { forwardRef } from "react";
export type MethRes = {
  txHash: `0x${string}` | undefined;
  claims: any | undefined;
};

interface ProgressProps {
  res: MethRes;
  isSuccess: boolean;
  isMinting: boolean;
  onClick: () => void;
}

const ProgressPopup = forwardRef(function ProgressPopup(
  props: ProgressProps,
  ref
) {
  const { res, isSuccess, onClick, isMinting } = props;
  const Monitor = () => {
    if (isMinting) {
      return (
        <div className="loader">
          <div className="circles">
            <span className="one"></span>
            <span className="two"></span>
            <span className="three"></span>
          </div>
          <div className="pacman">
            <span className="top"></span>
            <span className="bottom"></span>
            <span className="left"></span>
            <div className="eye"></div>
          </div>
        </div>
      );
    } else if (!isMinting && isSuccess) {
      return (
        <div className={`w-full flex justify-center items-center h-[100px]`}>
          <p className={`text-center block text-[20px]`}>{res.txHash}</p>;
        </div>
      );
    } else {
      return (
        <div className={`w-full flex justify-center items-center h-[100px]`}>
          <p className={`text-center block text-[20px]`}>Transaction Failed</p>
        </div>
      );
    }
  };

  return (
    <dialog
      className={`lg:w-[45%] md:w-[45%] w-[90%] relative h-[350px] lg:px-[80px] md:px-[60px] px-[20px] py-[50px] backdrop:bg-neutral-900/90 inset-0 backdrop-blur z-[30] rounded-xl`}
      ref={ref as React.LegacyRef<HTMLDialogElement>}
    >
      <p
        className={`block lg:text-[25px] md:text-[20px] text-[19px] font-bold`}
      >
        Processing Hypercert
      </p>
      <p
        className={`block lg:text-[18px] md:text-[18px] text-[16px] italic text-neutral-700`}
      >
        Please keep this tab open until completion
      </p>
      {!isMinting && (
        <button
          className={`w-[25px] h-[25px] p-1 absolute flex justify-center items-center right-1 top-1 rounded-full bg-black`}
          onClick={onClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="22"
            height="22"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      <Monitor />
    </dialog>
  );
});

export default ProgressPopup;
