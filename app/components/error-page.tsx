import { SearchX } from "lucide-react";
function ErrorPage() {
  return (
    <div
      className={`block text-white w-full h-[600px] p-[40px] ibm-plex space-y-2`}
    >
      <SearchX size={70} />
      <p className={`text-white font-semibold text-[30px] mb-[20px]`}>
        No project found
      </p>
      <p className={`text-[20px]`}>Try:</p>
      <ul className={`list-disc text-[18px] space-y-1`}>
        <li>Confirming your connected Wallet is a project owner</li>
        <li>Confirm your round and project</li>
      </ul>
    </div>
  );
}

export default ErrorPage;
