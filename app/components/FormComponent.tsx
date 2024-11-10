import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Progress } from "~/components/ui/progress";
import { Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { addDays, format } from "date-fns";
import * as dayjs from "dayjs";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import ProjectCard from "./cards/ProjectCard";
import { useWalletClient } from "wagmi";
import { HypercertClient } from "@hypercerts-org/sdk";

interface HypercertCreateFormData {
  name: string;
  description: string;
  externalLink: string;
  logoUrl: string;
  //logoImage: File | null;
  bannerUrl: string;
  //bannerImage: File | null;
  impactScopes: string[];
  //impactTimeStart?: string;
  impactTimeEnd?: string;
  //| DateIndefinite;
  workScopes: string;
  workTimeStart?: string;
  workTimeEnd?: string;
  rights: string[];
  contributors: string;
  allowlistUrl: string;
  allowlistPercentage: number;
  deduplicateAllowlist: boolean;
  agreeContributorsConsent: boolean;
  agreeTermsConditions: boolean;
  // Hidden
  backgroundColor: string;
  backgroundVectorArt: string;
  metadataProperties: string;
}

function FormComponent({ data }: { data: any }) {
  const tabs = ["General", "Who did what & when", "Mint"];
  const { data: walletClient } = useWalletClient();
  const httpsUrlPattern = /^https:\/\/.+/;
  const [activeTab, setActivetab] = useState(0);
  const [hypercertClient, setHypercertClient] = useState<
    HypercertClient | undefined
  >(undefined);
  const [workTimeframe, setWorkTimeframe] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 6),
  });
  const [impactTimeframe, setImpactTimeframe] = useState<DateRange | undefined>(
    {
      from: new Date(),
      to: addDays(new Date(), 6),
    }
  );
  const onSubmit: SubmitHandler<HypercertCreateFormData> = (data) =>
    console.log(data);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors },
  } = useForm<HypercertCreateFormData>({ mode: "onTouched" });
  const { name, bannerUrl, logoUrl } = watch();
  const [workScopes, setWorkScopes] = useState<string[]>([]);
  const fieldsToValidate: (
    | "name"
    | "description"
    | "externalLink"
    | "logoUrl"
    | "bannerUrl"
    | "workScopes"
    | "contributors"
  )[][] = [
    ["name", "description", "logoUrl", "bannerUrl"],
    ["workScopes", "contributors"],
  ];

  const handleNextClick = async () => {
    const isValid = await trigger(fieldsToValidate[0]);
    if (isValid && activeTab >= 0 && activeTab < tabs.length) {
      setActivetab((p) => p + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousClick = () => {
    if (activeTab > 0) {
      setActivetab((p) => p - 1);
      window.scrollTo(0, 0);
    }
  };

  // useEffect(() => {
  //   if (workScope) {
  //     const wordsArray = workScope
  //       .split(",")
  //       .map((word) => word.trim())
  //       .filter((word) => word.length > 0);
  //     setWorkScopes(wordsArray);
  //   }
  // }, [workScope]);
  // console.log(workScopes);

  useEffect(() => {
    if (data && data.applications && data.applications.length > 0) {
      const application = data.applications[0];
      console.log("Effect ran");
      const { metadata } = application.project;
      reset({
        name: metadata.title,
        description: metadata.description,
        externalLink: metadata.website,
        logoUrl: `https://ipfs.io/ipfs/${metadata.logoImg}`,
        bannerUrl: `https://ipfs.io/ipfs/${metadata.bannerImg}`,
      });
    }
  }, [data]);
  useEffect(() => {
    if (!walletClient) return;
    const myClient = new HypercertClient({
      walletClient: walletClient,
      environment:
        process.env.NODE_ENV === "development" ? "test" : "production",
    });

    setHypercertClient(myClient);
    console.log("Hypercert client set");
  }, [walletClient]);
  return (
    <div className={`w-fit justify-center h-full flex space-x-[40px]`}>
      <div className={`w-[500px] block mt-[20px]`}>
        <div className={`w-full h-fit space-y-3`}>
          <Progress
            value={33.3 * (activeTab + 1)}
            className={`w-[95%] block mx-auto h-[8px]`}
          />
          <div className={`flex items-center justify-between px-[30px]`}>
            {tabs.map((tab, i) => (
              <div
                className={`inline-flex items-center gap-x-3 py-2 px-3 rounded-lg ${
                  activeTab === i && "bg-[#f1f5f9]"
                }`}
                key={tab}
              >
                <div
                  className={`flex justify-center items-center w-[28px] h-[20px] ${
                    activeTab === i && "bg-purple-500 border-0"
                  } rounded-[10px] border`}
                >
                  <p
                    className={`text-[14px] text-[#778599] ${
                      activeTab === i && "text-white"
                    } font-semibold`}
                  >
                    {i + 1}
                  </p>
                </div>
                <p
                  className={`text-[16px] ${
                    activeTab === i && "font-bold text-neutral-700"
                  } text-[#778599]`}
                >
                  {tab}
                </p>
              </div>
            ))}
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`w-full p-3 space-y-5 mt-[20px]`}
        >
          {activeTab === 0 && (
            <>
              <fieldset className={`w-full space-y-1`}>
                <label
                  htmlFor="name"
                  className={`text-[15px] font-bold text-purple-500`}
                >
                  Title
                </label>
                <input
                  {...register("name", { required: true })}
                  aria-invalid={errors.name ? true : false}
                  className={`w-full h-[40px] rounded-lg border px-2`}
                />
                {errors.name?.type === "required" && (
                  <p className={`mt-2 text-red-600 text-[12px]`}>
                    We need a title for your hypercert
                  </p>
                )}
                <p className={`text-[#778599] text-[13px]`}>
                  Keep it short but descriptive
                </p>
              </fieldset>
              <fieldset className={`w-full space-y-1`}>
                <label
                  htmlFor="description"
                  className={`text-[15px] font-bold text-purple-500`}
                >
                  Description
                </label>
                <textarea
                  {...register("description", { required: true })}
                  className={`w-full h-[90px] rounded-lg border p-2`}
                  aria-invalid={
                    errors.description?.type === "required" ? true : false
                  }
                />
                {errors.description?.type === "required" && (
                  <p className={`mt-2 text-red-600 text-[12px]`}>
                    We need a longer description for your hypercert
                  </p>
                )}
                <p className={`text-[#778599] text-[13px]`}>
                  Describe your project: why it was created, and how it works
                </p>
              </fieldset>
              <fieldset className={`w-full space-y-1`}>
                <label
                  htmlFor="externalLink"
                  className={`text-[15px] font-bold text-purple-500`}
                >
                  Link (optional)
                </label>
                <input
                  placeholder="https://"
                  {...register("externalLink")}
                  className={`w-full h-[40px] rounded-lg border px-2`}
                />
                <p className={`text-[#778599] text-[13px]`}>
                  Paste a link to your impact report or your project
                </p>
              </fieldset>
              <fieldset className={`w-full space-y-1`}>
                <label
                  htmlFor="logoUrl"
                  className={`text-[15px] font-bold text-purple-500`}
                >
                  Logo
                </label>
                <input
                  placeholder="https://"
                  {...register("logoUrl", {
                    required: "Logo URL is required",
                    pattern: {
                      value: httpsUrlPattern,
                      message: "Logo URL is not valid",
                    },
                    validate: {
                      validUrl: (value) => {
                        if (!value) return true; // Skip if empty (handle with required if needed)
                        try {
                          new URL(value);
                          return true;
                        } catch {
                          return "Please enter a valid URL";
                        }
                      },
                    },
                  })}
                  aria-invalid={errors.logoUrl ? true : false}
                  className={`w-full h-[40px] rounded-lg border px-2`}
                />
                {errors.logoUrl && (
                  <p className={`mt-2 text-red-600 text-[12px]`}>
                    {errors.logoUrl.message}
                  </p>
                )}
                <p className={`text-[#778599] text-[13px]`}>
                  The URL to your project logo
                </p>
              </fieldset>
              <fieldset className={`w-full space-y-1`}>
                <label
                  htmlFor="bannerUrl"
                  className={`text-[15px] font-bold text-purple-500`}
                >
                  Banner image
                </label>
                <input
                  placeholder="https://"
                  {...register("bannerUrl", {
                    required: "Banner URL is required",
                    pattern: {
                      value: httpsUrlPattern,
                      message: "Banner URL is not valid",
                    },
                    validate: {
                      validUrl: (value) => {
                        if (!value) return true; // Skip if empty (handle with required if needed)
                        try {
                          new URL(value);
                          return true;
                        } catch {
                          return "Please enter a valid URL";
                        }
                      },
                    },
                  })}
                  aria-invalid={errors.bannerUrl ? true : false}
                  className={`w-full h-[40px] rounded-lg border px-2`}
                />
                {errors.bannerUrl && (
                  <p className={`mt-2 text-red-600 text-[12px]`}>
                    {errors.bannerUrl.message}
                  </p>
                )}
                <p className={`text-[#778599] text-[13px]`}>
                  The URL to an image to be displayed as the banner
                </p>
              </fieldset>
            </>
          )}
          {activeTab === 1 && (
            <>
              <fieldset className={`w-full space-y-1`}>
                <label htmlFor="workTimeframe" className={``}>
                  Time of work
                </label>
                <div className={`block`}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="workTimeframe"
                        variant={"outline"}
                        className={cn(
                          "w-[300px] justify-start text-left font-normal",
                          !workTimeframe && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {workTimeframe?.from ? (
                          workTimeframe.to ? (
                            <>
                              {format(workTimeframe.from, "LLL dd, y")} -{" "}
                              {format(workTimeframe.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(workTimeframe.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={workTimeframe?.from}
                        selected={workTimeframe}
                        onSelect={setWorkTimeframe}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <p className={`text-[#778599] text-[13px]`}>
                  The start and end date of the work represented by the
                  hypercert
                </p>
              </fieldset>
              <fieldset className={`w-full space-y-1`}>
                <label htmlFor="impactTimeFrame" className={``}>
                  Time of impact
                </label>
                <div className={`block`}>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="impactTimeFrame"
                        variant={"outline"}
                        className={cn(
                          "w-[300px] justify-start text-left font-normal",
                          !impactTimeframe && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {impactTimeframe?.from ? (
                          impactTimeframe.to ? (
                            <>
                              {format(impactTimeframe.from, "LLL dd, y")} -{" "}
                              {format(impactTimeframe.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(impactTimeframe.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={impactTimeframe?.from}
                        selected={impactTimeframe}
                        onSelect={setImpactTimeframe}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <p className={`text-[#778599] text-[13px]`}>
                  The start and end date of the impact represented by the
                  hypercert
                </p>
              </fieldset>
              <fieldset className={`w-full space-y-1`}>
                <label
                  htmlFor="workScope"
                  className={`text-[15px] font-bold text-purple-500`}
                >
                  Work Scope
                </label>
                <textarea
                  placeholder="Seperate tags with commas"
                  {...register("workScopes", {
                    required: true,
                    validate: {
                      notEmpty: (value) =>
                        value
                          .split(",")
                          .some((word) => word.trim().length > 0) ||
                        "Please enter at least one word",
                    },
                  })}
                  className={`w-full h-[90px] rounded-lg border p-2`}
                />
                <p className={`text-[#778599] text-[13px]`}>
                  Tags are used to categorize your project. (Max: 20)
                </p>
              </fieldset>
              <fieldset className={`w-full space-y-1`}>
                <label
                  htmlFor="contributors"
                  className={`text-[15px] font-bold text-purple-500`}
                >
                  Contributors
                </label>
                <textarea
                  placeholder="Seperate contributors with commas"
                  {...register("contributors", { required: true })}
                  className={`w-full h-[90px] rounded-lg border p-2`}
                />
                <p className={`text-[#778599] text-[13px]`}>
                  Tags are used to categorize your project. (Max: 20)
                </p>
              </fieldset>
            </>
          )}
          {activeTab === 2 && <></>}
          <div className={`flex w-full h-[80px] items-center justify-between`}>
            {activeTab > 0 && (
              <button
                onClick={handlePreviousClick}
                type="button"
                className={`hover:bg-[#e7eff3] hover:border-0 active:translate-y-[2px] h-[40px] w-[100px] border flex items-center text-neutral-700 justify-center space-x-2 rounded-lg`}
              >
                <ArrowLeft size={15} />
                <p>Previous</p>
              </button>
            )}
            <button
              onClick={() => reset()}
              type="button"
              className={`bg-purple-500 hover:opacity-[0.8] active:translate-y-[2px] h-[40px] w-[100px] flex items-center text-white justify-center space-x-2 rounded-lg`}
            >
              <Trash2 size={15} />
              <p>Reset</p>
            </button>

            {activeTab + 1 !== tabs.length && (
              <button
                onClick={handleNextClick}
                type="button"
                className={`bg-purple-500 hover:opacity-[0.8] active:translate-y-[2px] h-[40px] w-[100px] flex items-center text-white justify-center space-x-2 rounded-lg`}
              >
                <p>Next</p>
                <ArrowRight size={15} />
              </button>
            )}
            {activeTab + 1 === tabs.length && (
              <button
                type="button"
                className={`bg-purple-500 hover:opacity-[0.8] active:translate-y-[2px] h-[40px] w-[100px] flex items-center text-white justify-center rounded-lg`}
              >
                Mint
              </button>
            )}
          </div>
        </form>
      </div>
      <div className={`w-[350px] relative`}>
        <ProjectCard
          name={name}
          logoImage={logoUrl}
          bannerImage={bannerUrl}
          className={`absolute top-[40%] translate-y-[-40%]`}
          workTimeFrame={workTimeframe as DateRange}
        />
      </div>
    </div>
  );
}
export default FormComponent;
