import { useLoaderData, useNavigate } from "@remix-run/react";
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
import { getApplications } from "~/utils/indexer/graph.client";
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
  try {
    const roundsModule = await import(`~/rounds-data.json`);
    const RoundsData: Round[] = roundsModule.default;
    return {
      RoundsData: RoundsData,
    };
  } catch (error) {
    console.error("Dynamic import error:", error);
    return Response.json(
      { error: "Failed to load rounds data" },
      { status: 500 }
    );
  }
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
  const { name, chain_id, round_id } = round;
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
  const { address, isConnected } = useAccount();
  const account =
    process.env.NODE_ENV === "development"
      ? "0xe3F4F3aD70C1190EC480554bbc3Ed30285aE0610"
      : address;
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    logoImage: "",
    bannerImage: "",
  });
  const data = useMemo(() => {
    return RoundsData.filter((r: Round) => r.program === year);
  }, [RoundsData, year]);

  const onRoundChange = (value: string) => {
    const round = data.find((item: Round) => item.name === value);
    if (round) {
      setRound(round);
    }
  };
  const isDisabled = useMemo(() => {
    return Boolean(chain_id && round_id && projectDetails.name && isConnected);
  }, [chain_id, round_id, projectDetails, isConnected]);

  const {
    data: queryResult,
    fetchStatus,
    status,
  } = useQuery({
    queryKey: ["applications", round_id, chain_id, account],
    queryFn: () =>
      getApplications({
        id: round_id?.toString() || "",
        chainId: chain_id || 0,
        creator: account?.toLowerCase() || "",
      }),
    enabled: Boolean(round_id && chain_id && account),
  });

  useEffect(() => {
    if (queryResult) {
      const [error, data] = queryResult;

      if (error) {
        console.error(error);
        setProjectDetails({ name: "", logoImage: "", bannerImage: "" });
        return;
      }

      const application = data?.applications?.[0];
      const metadata = application?.project?.metadata;

      setProjectDetails({
        name: metadata?.title || "",
        logoImage: metadata?.logoImg
          ? `https://ipfs.io/ipfs/${metadata.logoImg}`
          : "",
        bannerImage: metadata?.bannerImg
          ? `https://ipfs.io/ipfs/${metadata.bannerImg}`
          : "",
      });
    }
  }, [queryResult]);

  const navigate = useNavigate();
  return (
    <div
      className={`lg:w-[80%] md:w-[80%] w-full flex flex-col items-center lg:flex-row md:flex-row lg:items-start md:items-start lg:mx-auto md:mx-auto mx-0 lg:pt-[150px] md:pt-[150px] pt-[90px] gap-y-[40px] pb-[90px] h-fit justify-between`}
    >
      <div className={`lg:w-[350px] md:w-[350px] w-[300px]`}>
        <p className={`text-neutral-700 font-semibold text-[20px] mb-[33px]`}>
          Enter your round details
        </p>

        <Select onValueChange={onYearChange} value={year}>
          <SelectTrigger
            className={`w-full border border-neutral-700 h-[50px] text-purple-500`}
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
            className={`w-full text-purple-500 border border-neutral-700 h-[50px] mt-[30px] ${
              !year ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <SelectValue placeholder="Select your project" />
          </SelectTrigger>
          <SelectContent>
            {data !== undefined &&
              data.map((item: any, i: number) => (
                <SelectItem key={i} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {!isConnected && (
          <div
            className={`flex items-center justify-between p-3 rounded-lg border bg-blue-100 border-blue-200 w-full h-[35px] mt-3`}
          >
            <div className="flex items-center space-x-2">
              <span className={`text-blue-800`}>
                <Info size={18} />
              </span>
              <span className={`text-blue-800 font-medium`}>
                Connect wallet used to create application
              </span>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() =>
            navigate({
              pathname: "/form",
              search: `?chainId=${chain_id}&roundId=${round_id}&address=${account}`,
            })
          }
          disabled={!isDisabled}
          className={`text-neutral-700 hover:bg-opacity-[0.8] disabled:opacity-[0.5] disabled:bg-gray-300 disabled:cursor-not-allowed bg-purple-500 rounded-lg mx-auto mt-[50px] flex justify-center items-center p-2`}
        >
          Edit Hypercert
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
