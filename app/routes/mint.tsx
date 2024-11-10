import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useAccount } from "wagmi";
import CardSkeleton from "~/components/cards/CardSkeleton";
import { fetchData } from "~/utils/indexer/graph.client";
import CardOutline from "~/components/cards/CardOutline";
import { Info } from "lucide-react";
import ProjectCard from "~/components/cards/ProjectCard";

type Round = {
  program: string;
  name: string;
  round_id: number;
  chain_id: number;
  bannerImg: string;
  seed: string;
};

interface RoundData {
  program: string;
  name: string;
  round_id: number | undefined;
  chain_id: number | undefined;
  seed: string;
}

export const loader = async () => {
  const RoundsData: Round[] = (await import(`~/rounds-data.json`))
    .default as Round[];
  return json({ RoundsData });
};

function MintPage() {
  const [year, setYear] = useState("");
  const [round, setRound] = useState<RoundData>({
    program: "",
    name: "",
    round_id: undefined,
    chain_id: undefined,
    seed: "",
  });
  const { program, name, chain_id, round_id } = round;
  const { RoundsData } = useLoaderData<typeof loader>();
  const onYearChange = (value: string) => {
    setYear(value);
    setRound({
      program: "",
      name: "",
      round_id: undefined,
      chain_id: undefined,
      seed: "",
    });
  };
  console.log(program, chain_id, round_id);
  const { address, isConnected } = useAccount();
  const account =
    process.env.NODE_ENV === "development"
      ? "0xdc2a4bf46ef158f86274c02bd7f027f31da9ebc1"
      : address;
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    logoImage: "",
    bannerImage: "",
  });
  const data = useMemo(() => {
    return RoundsData.filter((r) => r.program === year);
  }, [RoundsData, year]);

  const onRoundChange = (value: string) => {
    const round = data.find((item) => item.name === value);
    if (round) {
      setRound(round);
    }
  };
  const {
    data: pData,
    fetchStatus,
    status,
  } = useQuery({
    queryKey: ["applications", round_id, chain_id, account],
    queryFn: () =>
      fetchData({
        id: round_id?.toString() || "",
        chainId: chain_id || 0,
        creator: account || "",
      }),
    enabled: Boolean(round_id && chain_id && account),
  });
  console.log(pData);
  useEffect(() => {
    //@ts-expect-error"type unnown"
    if (pData && pData.applications && pData.applications.length > 0) {
      //@ts-expect-error"type unnown"
      const application = pData.applications[0];
      const { metadata } = application.project;

      setProjectDetails((p) => ({
        ...p,
        name: metadata.title,
        logoImage: `https://ipfs.io/ipfs/${metadata.logoImg}`,
        bannerImage: `https://ipfs.io/ipfs/${metadata.bannerImg}`,
      }));
    } else {
      setProjectDetails({ name: "", logoImage: "", bannerImage: "" });
    }
  }, [pData]);
  const navigate = useNavigate();
  return (
    <div
      className={`flex justify-between w-[900px] mx-auto pt-[90px] h-[90vh] items-center`}
    >
      <div className={`w-[350px]`}>
        <p className={`text-neutral-700 font-semibold text-[20px] mb-[33px]`}>
          Enter your round details
        </p>

        <Select onValueChange={onYearChange} value={year}>
          <SelectTrigger
            className={`lg:w-[350px] md:w-[350px] border border-neutral-700 w-[270px] h-[50px] text-purple-500`}
          >
            <SelectValue className={``} placeholder="Select Gitcoin round" />
          </SelectTrigger>
          <SelectContent className={`text-purple-500`}>
            <SelectItem value="GG20">GG20</SelectItem>
            <SelectItem value="GG21">GG21</SelectItem>
            <SelectItem value="GG22">GG22</SelectItem>
          </SelectContent>
        </Select>
        <Select value={name} onValueChange={onRoundChange} disabled={!year}>
          <SelectTrigger
            className={`lg:w-[350px] md:w-[350px] text-purple-500 border border-neutral-700 w-[270px] h-[50px] mt-[30px] ${
              !year ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <SelectValue placeholder="Select your project" />
          </SelectTrigger>
          <SelectContent>
            {data !== undefined &&
              data.map((item, i) => (
                <SelectItem key={i} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {!isConnected && (
          <div
            className={`flex items-center justify-between p-3 rounded-lg border bg-blue-100 border-blue-200 lg:w-[350px] md:w-[350px] w-[270px] h-[35px] mt-3`}
          >
            <div className="flex items-center space-x-2">
              <span className={`text-blue-800`}>
                <Info size={18} />
              </span>
              <span className={`text-blue-800 font-medium`}>
                Connect your payout wallet
              </span>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() =>
            navigate(
              `/form?chainId=${chain_id}&roundId=${round_id}&address=${account}`,
              { replace: true }
            )
          }
          disabled={!(chain_id && round_id && projectDetails.name)}
          className={`text-neutral-700 hover:bg-opacity-[0.8] disabled:opacity-[0.5] disabled:bg-gray-300 disabled:cursor-not-allowed bg-purple-500 rounded-lg mx-auto mt-[50px] flex justify-center items-center p-2`}
        >
          Mint Hypercert
        </button>
      </div>
      {fetchStatus === "idle" && status === "pending" && <CardOutline />}
      {fetchStatus === "fetching" && status === "pending" && <CardSkeleton />}
      {fetchStatus === "idle" &&
        status === "success" &&
        projectDetails.name && <ProjectCard {...projectDetails} />}
      {fetchStatus === "idle" &&
        status === "success" &&
        !projectDetails.name && (
          <CardOutline msg="Project not found for this account" />
        )}
    </div>
  );
}
export default MintPage;
