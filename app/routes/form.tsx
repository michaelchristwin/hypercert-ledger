import type { MetaFunction, LoaderFunctionArgs } from "@vercel/remix";
import { useSearchParams } from "@remix-run/react";
import { json, useLoaderData } from "@remix-run/react";
import { fetchData } from "~/utils/indexer/graph.server";
import html2canvas from "html2canvas";
import { Colors } from "~/utils/randomizer/styles/colors";
import {
  getChain,
  ISOToUNIX,
  isValid,
  mintHypercert,
  MyMetadata,
} from "~/actions/hypercerts";
import { memo, useRef, useState, useEffect } from "react";
import { prepareAllowlist } from "~/utils/mint-utils";
import { AllowlistEntry, HypercertClient } from "@hypercerts-org/sdk";
import { useAccount, useWalletClient } from "wagmi";
import { optimism, sepolia } from "viem/chains";
import ProgressPopup, { MethRes } from "~/components/Progress";
import Validity from "~/components/ValidImage";
import TextArea from "~/components/TextArea";
import MyHypercert from "~/components/MyHypercert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

export const meta: MetaFunction = () => {
  return [
    { title: "Hyperminter" },
    {
      name: "description",
      content: "A tool for minting project based Hypercerts onchain.",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const chainId = url.searchParams.get("chainId");
  const roundId = url.searchParams.get("roundId");
  const address = url.searchParams.get("address");
  if (!chainId || isNaN(Number(chainId))) {
    return json({ error: "Invalid or missing chainId" }, { status: 400 });
  }
  if (!roundId) {
    return json({ error: "Invalid or missing roundId" }, { status: 400 });
  }
  if (!address) {
    return json({ error: "Invalid or missing address" }, { status: 400 });
  }
  let account =
    process.env.NODE_ENV === "development"
      ? "0xdc2a4bf46ef158f86274c02bd7f027f31da9ebc1"
      : address;

  const data = await fetchData({
    chainId: Number(chainId),
    id: roundId,
    creator: account,
  });

  return json({ data });
};

function Form() {
  const dataRes = useLoaderData<typeof loader>();
  if ("error" in dataRes) {
    const { error } = dataRes;
    console.error(error);
  }
  //@ts-ignore
  const { data } = dataRes;
  const { address } = useAccount();
  const { data: WalletClient } = useWalletClient();
  const [searchParams] = useSearchParams();
  const urlSearchParamChainId = searchParams.get("chainId") || "";
  const roundId = searchParams.get("roundId") || "";
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const cardRef = useRef<HTMLDivElement | undefined>(undefined);
  const currentYear = new Date();
  const cY = currentYear.getFullYear();
  const [allow, setAllow] = useState(false);
  const [formDates, setFormDates] = useState({
    workTimeframeStart: `${cY}-01-01`,
    workTimeframeEnd: currentYear.toISOString().slice(0, 10),
    impactTimeframeStart: `${cY}-01-01`,
    impactTimeframeEnd: currentYear.toISOString().slice(0, 10),
  });

  const initialState: MyMetadata = {
    name: "",
    description: "",
    external_url: "",
    image: "",
    version: "1.0",
    properties: undefined,
    impactScope: ["All"],
    excludedImpactScope: [],
    workScope: [],
    excludedWorkScope: [],
    workTimeframeStart: ISOToUNIX(new Date(formDates.workTimeframeStart)),
    workTimeframeEnd: ISOToUNIX(new Date(formDates.workTimeframeEnd)),
    impactTimeframeStart: ISOToUNIX(new Date(formDates.impactTimeframeStart)),
    impactTimeframeEnd: ISOToUNIX(new Date(formDates.impactTimeframeEnd)),
    contributors: [],
    rights: ["Public Display"],
    excludedRights: [],
  };
  const [formValues, setFormValues] = useState<MyMetadata>(initialState);
  const [workScopeStored, setWorkScopeStored] = useState<string[]>([]);
  const [allowRange, setAllowRange] = useState<number>(50);
  const [myworkScope, setWorkScopes] = useState<string>("");
  const [formImages, setFormImages] = useState({
    logoImage: "",
    bannerImage: "",
  });
  const [res, setRes] = useState<MethRes>();
  const [hyperClient, setHyperClient] = useState<HypercertClient | undefined>(
    undefined
  );
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [_contributorsStored, setContributorsStored] = useState<any[]>([]);
  const [myContributors, setContributors] = useState<string>("");
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const ProjectCard = memo(MyHypercert);
  let dappChain = process.env.NODE_ENV === "development" ? sepolia : optimism;
  const { name, description, external_url } = formValues;
  const { logoImage, bannerImage } = formImages;
  let account =
    process.env.NODE_ENV === "development"
      ? "0xdc2a4bf46ef158f86274c02bd7f027f31da9ebc1"
      : (address as string);

  useEffect(() => {
    if (!WalletClient) return;

    try {
      const myClient = new HypercertClient({
        walletClient: WalletClient,
        environment:
          process.env.NODE_ENV === "development" ? "test" : "production",
      });

      setHyperClient(myClient);
      console.log("Hypercert client set");
    } catch (err) {
      console.error("Failed to create client:", err);
    }
  }, [WalletClient]);

  useEffect(() => {
    // @ts-ignore
    if (data && data.applications && data.applications.length > 0) {
      //@ts-ignore
      const application = data.applications[0];
      console.log("Effect ran");
      if (
        String(application.createdByAddress).toLowerCase() !==
        account.toLowerCase()
      ) {
        console.warn("Application does not belong to the current account");
        return;
      }
      const { metadata } = application.project;
      setFormValues((f) => ({
        ...f,
        name: metadata.title,
        description: metadata.description,
        external_url: metadata.website,
      }));
      setFormImages({
        logoImage: `https://ipfs.io/ipfs/${metadata.logoImg}`,
        bannerImage: `https://ipfs.io/ipfs/${metadata.bannerImg}`,
      });
      setAllow(true);
    }
  }, [data, account]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleImages = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormImages({
      ...formImages,
      [name]: value,
    });
  };

  const convertToDataURL = async () => {
    if (cardRef.current) {
      const dataurl = (
        await html2canvas(cardRef.current, {
          useCORS: true,
          backgroundColor: null,
        })
      ).toDataURL();
      return dataurl;
    }
  };

  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAllowRange(Number(value));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormValues((p) => ({
      ...p,
      workScope: workScopeStored,
    }));
    const { allowList, recipientUnits } = prepareAllowlist(
      //@ts-ignore
      data.applications[0],
      allowRange
    );

    const newAllowlist: AllowlistEntry[] = [
      ...allowList,
      {
        address: address as string,
        units: BigInt(recipientUnits),
      },
    ];
    if (WalletClient && Number(urlSearchParamChainId) !== dappChain.id) {
      WalletClient.switchChain(dappChain);
    }
    if (isValid(formValues) && hyperClient && triggerRef.current) {
      setIsMinting(true);
      triggerRef.current.click();
      try {
        const hyperImage = await convertToDataURL();
        if (!hyperImage) {
          throw new Error("Hypercert image is invalid");
        }
        const newvalues: MyMetadata = { ...formValues, image: hyperImage };

        console.log("Submit running");
        const response = await mintHypercert(
          newvalues,
          hyperClient,
          newAllowlist
        );

        setRes(response);
        setIsSuccess(true);
        setIsMinting(false);
      } catch (err) {
        setIsSuccess(false);
        setIsMinting(false);
        console.error("An error occurred:", err);
      }
    } else {
      console.error("A form value is invalid");
    }
  };

  const handleDates = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormDates((f) => ({
      ...f,
      [name]: value,
    }));
    const newDate = ISOToUNIX(new Date(value));
    setFormValues((f) => ({
      ...f,
      [name]: newDate,
    }));
  };

  return (
    <>
      <div
        className={`lg:flex md:flex block relative ${
          allow
            ? "lg:justify-center md:justify-center lg:space-x-[10%] md:space-x-[7%] mx-auto"
            : "lg:justify-center md:justify-center"
        }  h-fit py-[100px] w-full relative`}
      >
        <form
          className={`${
            allow ? "block" : "hidden"
          } lg:p-[40px] md:p-[30px] p-[20px] lg:w-[45%] md:w-[45%] w-[94%] space-y-3 rounded-[15px] morph lg:mx-0 md:mx-0 mx-auto`}
          onSubmit={onSubmit}
        >
          <hr />
          <p className={`text-[23px] text-violet-800 font-semibold`}>
            General Fields
          </p>
          <fieldset className={`w-[100%]`}>
            <label
              htmlFor="name"
              className={`text-white font-bold text-[16px] block mb-1`}
            >
              Hypercert Name
            </label>

            <input
              type="text"
              id="name"
              name="name"
              value={name}
              maxLength={70}
              required
              onChange={handleChange}
              placeholder="The name of your hypercert"
              className={`w-[100%] h-[45px] ps-2 peer bg-white/50 placeholder:text-black/60 rounded-[6px] focus:outline-none text-black`}
            />
            <p
              className={`text-red-600 italic invisible peer-required:visible`}
            >
              *
            </p>
          </fieldset>
          <fieldset className={`w-[100%]`}>
            <label
              htmlFor="logoImage"
              className={`text-white font-bold text-[16px] block mb-1`}
            >
              Logo Image
            </label>
            <div className={`w-[100%] h-fit relative`}>
              <input
                type="text"
                id="logoImage"
                required
                name="logoImage"
                value={logoImage}
                onChange={handleImages}
                placeholder="Image URL"
                className={`w-[100%] h-[45px] peer ps-2 pe-6 bg-white/50 placeholder:text-black/60  rounded-[6px] focus:outline-none text-black`}
              />
              <Validity url={logoImage} />
            </div>
            <p
              className={`text-red-600 italic invisible peer-required:visible`}
            >
              *
            </p>
          </fieldset>
          <fieldset className={`w-[100%]`}>
            <label
              htmlFor="bannerImage"
              className={`text-white font-bold text-[16px] block mb-1`}
            >
              Banner Image
            </label>
            <div className={`w-[100%] h-fit relative`}>
              <input
                type="text"
                id="bannerImage"
                name="bannerImage"
                value={bannerImage}
                onChange={handleImages}
                placeholder="Banner Image URL"
                className={`w-[100%] h-[45px] ps-2 pe-7 bg-white/50 placeholder:text-black/60  rounded-[6px] focus:outline-none text-black`}
              />
              <Validity url={bannerImage} />
            </div>
          </fieldset>
          <fieldset className={`w-[100%]`}>
            <label
              htmlFor="description"
              className={`text-white font-bold text-[16px] block mb-1`}
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={description}
              required
              onChange={handleChange}
              className={`w-[100%] p-2 peer h-[150px] bg-white/50 placeholder:text-black/60 rounded-[6px] focus:outline-none text-black`}
            ></textarea>
            <p
              className={`text-red-600 italic invisible peer-required:visible`}
            >
              *
            </p>
          </fieldset>
          <fieldset className={`w-[100%]`}>
            <label
              htmlFor="external_url"
              className={`text-white font-bold text-[16px] block mb-1`}
            >
              Link
            </label>
            <input
              type="text"
              id="external_url"
              name="external_url"
              value={external_url}
              onChange={handleChange}
              placeholder="https://project.org"
              className={`w-[100%] h-[45px] ps-2 bg-white/50 placeholder:text-black/60  rounded-[6px] focus:outline-none text-black`}
            />
          </fieldset>
          <hr />
          <p className={`text-[23px] text-violet-800 font-semibold`}>
            Hypercert Fields
          </p>
          <TextArea
            formValues={formValues}
            setFormValues={setFormValues}
            name="workScope"
            required={true}
            displayText={myworkScope}
            setDisplayText={setWorkScopes}
            setStoredValues={setWorkScopeStored}
            label="Work Scope"
          />
          <div
            className={`w-[100%] flex justify-center items-center space-x-2 h-[130px]`}
          >
            <fieldset className={`w-[48%]`}>
              <label
                htmlFor="workTimeframeStart"
                className={`text-white font-bold text-[16px] block mb-1`}
              >
                Work Start Date
              </label>

              <input
                type="date"
                name="workTimeframeStart"
                id="workTimeframeStart"
                value={formDates.workTimeframeStart}
                onChange={handleDates}
                className={`w-[100%] h-[45px] ps-2 bg-white/50 placeholder:text-black/60  rounded-[6px] focus:outline-none text-black`}
              />
            </fieldset>
            <fieldset className={`w-[48%]`}>
              <label
                htmlFor="workTimeframeEnd"
                className={`text-white font-bold text-[16px] block mb-1`}
              >
                Work End Date
              </label>
              <input
                type="date"
                name="workTimeframeEnd"
                id="workTimeframeEnd"
                value={formDates.workTimeframeEnd}
                onChange={handleDates}
                className={`w-[100%] h-[45px] ps-2 bg-white/50 placeholder:text-black/60  rounded-[6px] focus:outline-none text-black`}
              />
            </fieldset>
          </div>
          <TextArea
            placeolder="0xWalletAdress1, 0xWalletAdress2"
            formValues={formValues}
            label="Contributors"
            setDisplayText={setContributors}
            setFormValues={setFormValues}
            setStoredValues={setContributorsStored}
            name="contributors"
            displayText={myContributors}
          />

          <hr />
          <p className={`text-[23px] text-violet-800 font-semibold`}>
            Distribution
          </p>

          <fieldset className={`w-[100%]`}>
            <label
              htmlFor="distribution"
              className={`text-white font-bold text-[16px] block mb-1`}
            >
              Percentage distributed via allow List
            </label>
            <div className={`flex w-full space-x-2 items-center`}>
              <input
                type="range"
                step={1}
                min={0}
                max={100}
                value={allowRange}
                onChange={handleRangeChange}
                name="distribution"
                id="distribution"
                className={`w-[90%] border-0 bg-white outline-none`}
              />
              <div
                className={`w-[35px] flex justify-center items-center h-[35px] border border-gray-500`}
              >
                <p>{allowRange}</p>
              </div>
            </div>
          </fieldset>

          <button
            type="submit"
            className={`px-1 border w-[100px] bg-white text-black hover:opacity-75 active:opacity-60 rounded-lg mx-auto h-[35px] block`}
          >
            Create
          </button>
        </form>

        <div
          className={`w-fit ${
            allow ? "block" : "hidden"
          } h-fit sticky top-[100px] p-[40px] lg:mx-0 md:mx-0 mx-auto`}
        >
          <ProjectCard
            name={name}
            logoImg={logoImage}
            bannerImg={bannerImage}
            startDate={formDates.workTimeframeStart}
            endDate={formDates.workTimeframeEnd}
            chain={getChain(Number(urlSearchParamChainId))}
            ref={cardRef}
            roundId={roundId as string}
            workScope={workScopeStored}
            seed={roundId}
            color={Colors[selectedColorIndex]}
          />
        </div>
        <Accordion
          type="single"
          collapsible
          defaultValue="color"
          className={`fixed lg:bottom-1 lg:right-5 md:bottom-1 md:right-5 bottom-1 right-[50%] lg:translate-x-[0%] md:translate-x-[0%] translate-x-[50%]`}
        >
          <AccordionItem value="color" className={`border-none`}>
            <AccordionTrigger
              className={`text-white bg-black/30 backdrop-blur-lg px-[20px] rounded-t-[12px] w-[180px] transition-all duration-300 data-[state=open]:lg:w-[500px] data-[state=open]:md:w-[500px] data-[state=open]:w-[300px]`}
            >
              Change color
            </AccordionTrigger>
            <AccordionContent>
              <div
                className={`lg:w-[500px] md:w-[500px] w-[300px] lg:p-[20px] rounded-b-[12px] bg-black/30 backdrop-blur-lg md:p-[20px] p-[15px] items-center grid grid-cols-4 lg:grid-cols-6 md:grid-cols-5 gap-2 justify-items-center`}
              >
                {Colors.map((color, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColorIndex(i)}
                    style={{ backgroundColor: color }}
                    className={`w-[50px] h-[30px] rounded-[30px] ${
                      selectedColorIndex === i ? "ring-2 ring-blue-500" : ""
                    }`}
                  ></button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <ProgressPopup
        ref={triggerRef}
        isSuccess={isSuccess}
        isMinting={isMinting}
        res={res as MethRes}
      />
    </>
  );
}

export default Form;
