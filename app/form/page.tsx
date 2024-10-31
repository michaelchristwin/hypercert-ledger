"use client";

import { HypercertClient, AllowlistEntry } from "@hypercerts-org/sdk";
import { useAccount, useWalletClient } from "wagmi";
import html2canvas from "html2canvas";
import { useState, useRef, useEffect, memo, use } from "react";
import { optimism, sepolia } from "viem/chains";
import TextArea from "@/components/TextArea";
import MyHypercert from "@/components/MyHypercert";
import {
  MyMetadata,
  mintHypercert,
  ISOToUNIX,
  isValid,
  getChain,
} from "@/actions/hypercerts";
import { CgSpinner } from "react-icons/cg";
import ProgressPopup, { MethRes } from "@/components/Progress";
import Spinner from "@/components/Spinner";
import { prepareAllowlist } from "@/utils/mint-utils";
import useApplicationQuery from "@/hooks/useApplicationQuery";
import { useRouter } from "next/navigation";

function Page(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const ProjectCard = memo(MyHypercert);
  ProjectCard.displayName = "ProjectCard";
  const router = useRouter();
  const searchParams = use(props.searchParams);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const [myworkScope, setWorkScopes] = useState<string>("");
  const [allowRange, setAllowRange] = useState<number>(50);
  const [myContributors, setContributors] = useState<string>("");
  const [workScopeStored, setWorkScopeStored] = useState<string[]>([]);
  const [hyperClient, setHyperClient] = useState<HypercertClient | undefined>(
    undefined
  );
  const [res, setRes] = useState<MethRes>();

  const [_contributorsStored, setContributorsStored] = useState<any[]>([]);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  const { address, chainId } = useAccount();
  const { data: WalletClient } = useWalletClient();

  const mychainId = searchParams.chainId as string;
  const roundId = searchParams.roundId as string;
  let dappChain = process.env.NODE_ENV === "development" ? sepolia : optimism;
  let account =
    process.env.NODE_ENV === "development"
      ? "0xdc2a4bf46ef158f86274c02bd7f027f31da9ebc1"
      : (address as string);

  const cardRef = useRef<HTMLDivElement | undefined>(undefined);

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

  const {
    formValues,
    formImages,
    formDates,
    setFormValues,
    setFormDates,
    setFormImages,
    allow,
    isLoading,
    isError,
    applications,
  } = useApplicationQuery(roundId, Number(mychainId), account);
  const { name, description, external_url } = formValues;
  const { logoImage, bannerImage } = formImages;
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

  //Convert image to Data URL
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

  //Mint By Allowlist
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormValues({
      ...formValues,
      workScope: workScopeStored,
    });
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
    if (WalletClient && chainId !== dappChain.id) {
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

  const checkImage = (url: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => reject(false);
      img.src = url;
    });
  };

  const Validity = memo(({ url }: { url: string }) => {
    const [isValid, setIsValid] = useState<boolean>();
    useEffect(() => {
      if (url) {
        (async () => {
          try {
            let valid = await checkImage(url);
            setIsValid(valid);
          } catch (err) {
            setIsValid(false);
            console.log(err);
          }
        })();
      } else {
        setIsValid(undefined);
      }
    }, [url]);
    if (url && isValid === undefined) {
      return <Spinner className={`absolute top-[28%] right-2`} />;
    } else if (url && isValid) {
      return (
        <svg
          className={`absolute top-[28%] right-1`}
          fill="#43eb62"
          width={16}
          height={16}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0z"
            fill="#ffffff"
          />
          <path
            fill="#43eb62"
            d="M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"
          />
        </svg>
      );
    } else if (url && !isValid) {
      return (
        <svg
          className={`absolute top-[28%] right-2`}
          width={16}
          height={16}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"
            fill="#FF0000" // Red fill color for the outer shape
          />
          <path
            d="M11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"
            fill="#FFFFFF" // White fill color for the line
          />
        </svg>
      );
    } else {
      return null; // Assuming you want to return nothing when url is present but isValid is false or undefined, and when url is not present
    }
  });

  Validity.displayName = "Validity";

  if (isLoading) {
    return (
      <div
        className={`fixed z-40 top-0 left-0 h-[300px] w-full
        transition-all duration-300 pointer-events-none
         dark:h-[200px] dark:!bg-white/10 dark:rounded-[100%] ${
           isLoading
             ? "delay-0 opacity-1 -translate-y-1/2"
             : "delay-300 opacity-0 -translate-y-full"
         }`}
        style={{
          background: `radial-gradient(closest-side, rgba(0,10,40,0.2) 0%, rgba(0,0,0,0) 100%)`,
        }}
      >
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[30px] p-2 bg-white/80 dark:bg-gray-800
        rounded-lg shadow-lg`}
        >
          <CgSpinner className="text-3xl animate-spin" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className={`w-full h-[600px] py-[100px] block text-center space-y-2`}
      >
        <p className={`text-[17px] text-white`}>
          Failed to load project data, please wait and try again
        </p>
        <p
          className={`underline hover:no-underline hover:cursor-pointer text-blue-600`}
          onClick={() => router.refresh()}
        >
          Try again
        </p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className={`w-full h-[600px] space-y-2 py-[100px] text-center`}>
        <p className={`text-white text-[17px]`}>
          This project has no applications
        </p>
        <p
          className={`underline hover:no-underline hover:cursor-pointer text-blue-600`}
          onClick={() => router.push("/")}
        >
          Go back home
        </p>
      </div>
    );
  }
  return (
    <>
      <div
        className={`lg:flex md:flex block ${
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
            chain={getChain(Number(mychainId))}
            ref={cardRef}
            roundId={roundId as string}
            workScope={workScopeStored}
            seed={roundId}
          />
        </div>
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

export default Page;
