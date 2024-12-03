import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Progress } from "~/components/ui/progress";
import { Trash2, ArrowRight, ArrowLeft } from "lucide-react";
import { addDays, format } from "date-fns";
import dayjs from "dayjs";
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
import { Textarea } from "~/components/ui/textarea";
import ProjectCard from "./cards/ProjectCard";
import { useAccount, useWalletClient } from "wagmi";
import { AllowlistEntry, HypercertClient } from "@hypercerts-org/sdk";
import { HypercertMetadata, mintHypercert } from "~/actions/hypercerts";
import { parseListFromString } from "~/lib/parsing";
import html2canvas from "html2canvas";
import { prepareAllowlist } from "~/utils/mint-utils";
import { Slider } from "~/components/ui/slider";
import useProgressStore from "~/context/progress-store";

type Result<T, E = Error> = [E, null] | [null, T];

interface HypercertCreateFormData {
  name: string;
  description: string;
  external_url: string;
  logoUrl: string;
  properties?:
    | {
        trait_type: string;
        value: string;
      }[]
    | undefined;
  bannerUrl: string;
  excludedImpactScope: string[];
  workTimeframeStart: number;
  workTimeframeEnd: number;
  impactTimeframeStart: number;
  impactTimeframeEnd: number;
  impactScope: string[];
  rights: string[];
  excludedRights: string[];

  workScope: string;
  excludedWorkScope: string[];
}

function FormComponent({ data }: { data: any }) {
  const tabs = ["General", "Who did what & when", "Mint"];
  const { data: walletClient } = useWalletClient();
  const httpsUrlPattern = /^https:\/\/.+/;
  const { address } = useAccount();
  const { setIsOpen, setCurrentStep, updateOperationStatus } =
    useProgressStore();
  const cardRef = useRef<HTMLDivElement | undefined>(undefined);
  const [activeTab, setActivetab] = useState(0);
  const [distribution, setDistribution] = useState(50);
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
  const {
    register,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors },
  } = useForm<HypercertCreateFormData>({
    mode: "onTouched",
  });
  const { name, bannerUrl, logoUrl, workScope } = watch();

  const fieldsToValidate: (
    | "name"
    | "description"
    | "external_url"
    | "logoUrl"
    | "bannerUrl"
    | "workScope"
  )[][] = [["name", "description", "logoUrl", "bannerUrl"], ["workScope"]];

  const handleNextClick = async () => {
    const isValid = await trigger(fieldsToValidate[activeTab]);
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

  const hypercertClient = useMemo(() => {
    if (!walletClient) return;
    return new HypercertClient({
      walletClient: walletClient as any,
      environment:
        process.env.NODE_ENV === "development" ? "test" : "production",
    });
  }, [walletClient]);
  // console.log(hypercertClient);

  const onSubmit: SubmitHandler<HypercertCreateFormData> = async (formData) => {
    if (!hypercertClient) {
      console.error("Client Error");
      return;
    }
    const [error, image] = await exportAsImage(cardRef);
    if (error) {
      console.error(error);
      return;
    }
    const {
      name,
      description,
      impactScope,
      rights,
      excludedImpactScope,
      workScope,
      excludedWorkScope,
      external_url,
      excludedRights,
    } = formData;
    const { allowList, recipientUnits } = prepareAllowlist(
      data.applications[0],
      distribution
    );
    const newAllowlist: AllowlistEntry[] = [
      ...allowList,
      {
        address: address as `0x${string}`,
        units: BigInt(recipientUnits),
      },
    ];
    const c = newAllowlist.map((v) => {
      return v.address;
    });
    const metadata: HypercertMetadata = {
      name,
      description,
      external_url,
      image: image,
      impactScope,
      version: "",
      rights,
      excludedImpactScope,
      workTimeframeStart: dayjs(workTimeframe?.from).unix(),
      workTimeframeEnd: dayjs(workTimeframe?.to).unix(),
      impactTimeframeStart: dayjs(impactTimeframe?.from).unix(),
      impactTimeframeEnd: dayjs(impactTimeframe?.to).unix(),
      workScope: parseListFromString(workScope),
      excludedWorkScope,
      excludedRights,
      contributors: c,
    };
    setIsOpen(true);
    setCurrentStep("1");
    updateOperationStatus("1", "loading");
    const response = await mintHypercert(
      metadata,
      hypercertClient,
      newAllowlist
    );
    console.log(response);
  };
  useEffect(() => {
    if (data && data.applications && data.applications.length > 0) {
      const application = data.applications[0];
      console.log("Effect ran");
      const { metadata } = application.project;
      reset({
        name: metadata.title,
        description: metadata.description,
        external_url: metadata.website,
        logoUrl: `https://ipfs.io/ipfs/${metadata.logoImg}`,
        bannerUrl: `https://ipfs.io/ipfs/${metadata.bannerImg}`,
        impactScope: ["all"],
        rights: ["Public Display"],
        properties: undefined,
        excludedWorkScope: [],
        excludedImpactScope: [],
        excludedRights: [],
      });
    }
  }, [data]);

  const exportAsImage = async (
    ref: React.MutableRefObject<HTMLDivElement | undefined>
  ): Promise<Result<string>> => {
    if (!ref.current) {
      return [new Error("Image is invalid"), null];
    } else {
      try {
        const canvas = await html2canvas(ref.current, {
          logging: true,
          useCORS: true,
          backgroundColor: null,
        });
        const image = canvas.toDataURL("image/png", 1.0);
        return [null, image];
      } catch (e) {
        return [e instanceof Error ? e : new Error("Unknown error"), null];
      }
    }
  };
  return (
    <div
      className={`w-full justify-center flex flex-col-reverse items-center lg:flex-row md:flex-row lg:items-start md:items-start lg:space-x-[40px] md:space-x-[40px] lg:p-4 md:p-4 p-2 gap-y-4`}
    >
      <div
        className={`w-full max-w-[500px] lg:w-[500px] md:w-[500px] flex flex-col items-center lg:mt-[20px] md:mt-[20px] mt-[10px]`}
      >
        <div className={`w-full h-fit space-y-3`}>
          <Progress
            value={33.3 * (activeTab + 1)}
            className={`w-[93%] block mx-auto h-[8px]`}
          />
          <div
            className={`flex items-center justify-between lg:px-[30px] md:px-[30px] px-[0px] w-full`}
          >
            {tabs.map((tab, i) => (
              <div
                className={`lg:inline-flex md:block block items-center h-fit lg:gap-x-3 md:gap-x-3 gap-x-1 py-2 lg:px-3 md:px-3 px-2 rounded-lg ${
                  activeTab === i && "bg-[#f1f5f9]"
                }`}
                key={tab}
              >
                <div
                  className={`flex justify-center items-center w-[28px] h-[20px] mx-auto ${
                    activeTab === i && "bg-purple-500 border-0"
                  } rounded-full border`}
                >
                  <p
                    className={`px-2.5 py-0.5 text-xs text-[#778599] ${
                      activeTab === i && "text-white"
                    } font-bold`}
                  >
                    {i + 1}
                  </p>
                </div>
                <p
                  className={`lg:text-[16px] md:text-[16px] text-[15px] ${
                    activeTab === i && "font-semibold text-neutral-700"
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
          className={`w-full max-w-[450px] p- space-y-5 mt-[20px]`}
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
                <Textarea
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
                  {...register("external_url")}
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
                  {...register("workScope", {
                    required:
                      "Please ensure all tags are filled in and no longer than 50 characters",
                  })}
                  className={`w-full h-[90px] rounded-lg border p-2`}
                />
                {errors.workScope && (
                  <p className={`mt-2 text-red-600 text-[12px]`}>
                    {errors.workScope.message}
                  </p>
                )}
                <p className={`text-[#778599] text-[13px]`}>
                  Tags are used to categorize your project. (Max: 20)
                </p>
              </fieldset>

              <fieldset className={`w-full space-y-1`}>
                <label
                  htmlFor="distribution"
                  className={`text-[15px] font-bold text-purple-500`}
                >
                  Percentage distributed via allow List
                </label>
                <div
                  className={`inline-flex justify-between items-center w-full h-fit`}
                >
                  <Slider
                    id="distribution"
                    value={[distribution]}
                    max={100}
                    step={1}
                    min={1}
                    onValueChange={(v) => setDistribution(v[0])}
                    className={`w-[90%]`}
                  />
                  <div
                    className={`inline-flex items-center justify-center border border-neutral-700 rounded-full h-[30px] w-[30px]`}
                  >
                    <span>{distribution}</span>
                  </div>
                </div>
              </fieldset>
            </>
          )}
          {activeTab === 2 && <></>}
          <div className={`flex w-full h-[80px] items-center justify-between`}>
            {activeTab > 0 && (
              <button
                onClick={handlePreviousClick}
                type="button"
                className={`hover:bg-[#e7eff3] hover:border-0 active:translate-y-[2px] h-[40px] lg:w-[100px] md:w-[100px] w-[90px] border flex items-center text-neutral-700 justify-center space-x-2 rounded-lg`}
              >
                <ArrowLeft size={15} />
                <p>Previous</p>
              </button>
            )}
            <button
              onClick={() => reset()}
              type="button"
              className={`bg-purple-500 hover:opacity-[0.8] active:translate-y-[2px] h-[40px] lg:w-[100px] md:w-[100px] w-[90px] flex items-center text-white justify-center space-x-2 rounded-lg`}
            >
              <Trash2 size={15} />
              <p>Reset</p>
            </button>

            {activeTab + 1 !== tabs.length && (
              <button
                onClick={handleNextClick}
                type="button"
                className={`bg-purple-500 hover:opacity-[0.8] active:translate-y-[2px] h-[40px] lg:w-[100px] md:w-[100px] w-[90px] flex items-center text-white justify-center space-x-2 rounded-lg`}
              >
                <p>Next</p>
                <ArrowRight size={15} />
              </button>
            )}
            {activeTab + 1 === tabs.length && (
              <button
                type="submit"
                className={`bg-purple-500 hover:opacity-[0.8] active:translate-y-[2px] h-[40px] lg:w-[100px] md:w-[100px] w-[90px] flex items-center text-white justify-center rounded-lg`}
              >
                Mint
              </button>
            )}
          </div>
        </form>
      </div>
      <div
        className={`w-full max-w-[350px] flex justify-center mt-8 lg:mt-0 md:mt-0`}
      >
        <ProjectCard
          ref={cardRef}
          name={name}
          logoImage={logoUrl}
          bannerImage={bannerUrl}
          className={`lg:absolute md:absolute relative lg:top-[40%] md:top-[40%] top-0 lg:translate-y-[-40%] md:translate-y-[-40%] translate-y-[0%]`}
          workTimeFrame={workTimeframe as DateRange}
          workScope={workScope}
        />
      </div>
    </div>
  );
}
export default FormComponent;
