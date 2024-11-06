import { json, useLoaderData } from "@remix-run/react";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import CardSkeleton from "~/components/CardSkeleton";

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
  const data = useMemo(() => {
    return RoundsData.filter((r) => r.program === year);
  }, [RoundsData, year]);

  const onRoundChange = (value: string) => {
    const round = data.find((item) => item.name === value);
    if (round) {
      setRound(round);
    }
  };

  return (
    <div
      className={`flex justify-between w-full pt-[90px] items-center h-[500px]`}
    >
      <div className={`w-[500px]`}>
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
            className={`lg:w-[350px] md:w-[350px] text-purple-500 border border-neutral-700 w-[270px] h-[50px] mt-[40px] ${
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
      </div>
      <CardSkeleton />
    </div>
  );
}
export default MintPage;
