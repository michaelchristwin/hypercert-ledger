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
          <div
            className={`w-[140px] flex animate-animateContainer justify-center items-center h-[140px] bg-green-600 rounded-full`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M4 12.6111L8.92308 17.5L20 6.5"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
          </div>
          <p className={`text-[18px] text-green-600`}>
            Transaction Successeful
          </p>
          <p className={`block text-[16px]`}>Tx Hash: {res.txHash}</p>;
        </div>
      );
    } else {
      return (
        <div className={`w-full flex justify-center items-center h-[100px]`}>
          <div
            className={`w-[140px] flex animate-animateContainer justify-center items-center h-[140px] bg-red-600 rounded-full`}
          >
            <svg
              fill="#ffffff"
              height="70px"
              width="70px"
              version="1.1"
              id="Capa_1"
              className={`animate-animateCheck`}
              xmlns="http://www.w3.org/2000/svg"
              xmlSpace="preserve"
              viewBox="0 0 460.775 460.775"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"></path>
              </g>
            </svg>
          </div>
        </div>
      );
    }
  };

  return (
    <dialog
      className={`lg:w-[40%] md:w-[40%] w-[90%] relative h-[350px] lg:px-[70px] md:px-[60px] px-[20px] py-[30px] backdrop:bg-neutral-900/90 inset-0 backdrop-blur z-[30] rounded-[7px]`}
      ref={ref as React.LegacyRef<HTMLDialogElement>}
    >
      <p
        className={`block lg:text-[25px] md:text-[20px] text-[19px] font-bold`}
      >
        Processing Hypercert
      </p>
      {isMinting && (
        <p
          className={`block lg:text-[18px] md:text-[18px] text-[16px] italic text-neutral-700`}
        >
          Please keep this tab open until completion
        </p>
      )}
      {!isMinting && (
        <button
          className={`w-[25px] h-[25px] p-1 absolute flex justify-center items-center right-2 top-2 rounded-full bg-black`}
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
