import { LoaderCircle } from "lucide-react";

function LoadingOverlay() {
  return (
    <div
      className={`fixed z-40 top-0 left-0 h-[300px] w-full
        transition-all duration-300 pointer-events-none
         dark:h-[200px] dark:!bg-white/10 dark:rounded-[100%]delay-0 opacity-1 -translate-y-1/2`}
      style={{
        background: `radial-gradient(closest-side, rgba(0,10,40,0.2) 0%, rgba(0,0,0,0) 100%)`,
      }}
    >
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[30px] p-2 bg-white/80 dark:bg-gray-800
        rounded-lg shadow-lg`}
      >
        <LoaderCircle className="text-3xl text-black animate-spin" />
      </div>
    </div>
  );
}

export default LoadingOverlay;
