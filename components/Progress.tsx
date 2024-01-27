import { forwardRef } from "react";

const ProgressPopup = forwardRef(function ProgressPopup(props, ref) {
  return (
    <dialog
      className={`lg:w-[45%] md:w-[45%] w-[90%] h-[350px] px-[80px] py-[50px] backdrop:bg-neutral-900/90 inset-0 backdrop-blur z-[30] rounded-xl`}
      ref={ref as React.LegacyRef<HTMLDialogElement> | undefined}
    >
      <p className={`block text-[25px] font-bold`}>Processing Hypercert</p>
      <p className={`block text-[18px] italic text-neutral-700`}>
        Please keep this tab open until completion
      </p>
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
    </dialog>
  );
});

export default ProgressPopup;
