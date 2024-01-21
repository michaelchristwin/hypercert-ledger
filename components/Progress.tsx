import { useRef } from "react";

function ProgressPopup() {
  const diaRef = useRef<HTMLDialogElement | null>(null);
  const handleOpen = () => {
    if (diaRef.current) {
      diaRef.current.showModal();
    }
  };
  return (
    <dialog className={`w-[400px] h-[400px] p-[30px]`} ref={diaRef}>
      <p className={`text-center`}>This is a popup</p>
    </dialog>
  );
}

export default ProgressPopup;
