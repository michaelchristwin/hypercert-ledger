"use client";

import {
  MyMetadata,
  MintHypercert,
  ISOToUNIX,
  isValid,
  getChain,
} from "@/actions/hypercerts";
import { HypercertClient, AllowlistEntry } from "@hypercerts-org/sdk";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useState, useRef, useEffect } from "react";
import { createWalletClient, custom, WalletClient } from "viem";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import domtoimage from "dom-to-image";
import axios from "axios";
import { useAppContext } from "@/context/appContext";
import { uploadImage } from "@/actions/upload";
import TextArea, { convertArrayToDisplayText } from "@/components/TextArea";
import HyperCertCard2 from "@/components/HyperCertCard2";
declare let window: any;

let currentYear = new Date();
let cY = currentYear.getFullYear();

function Page() {
  const nftStorageToken = process.env.NEXT_PUBLIC_NFTSTORAGE;
  const searchParams = useSearchParams();
  const [client, setClient] = useState<HypercertClient | undefined>(undefined);
  const [allow, setAllow] = useState(false);
  const [walletCli, setWalletCli] = useState<WalletClient | undefined>(
    undefined
  );
  const [allowList, setallowList] = useState<AllowlistEntry[]>([]);

  const [allowRange, setAllowRange] = useState<number>(50);
  const [myContributors, setContributors] = useState<string>("");
  const [workScopeStored, setWorkScopeStored] = useState<string[]>([]);
  const [contributorsStored, setContributorsStored] = useState<any[]>([]);
  const [formImages, setFormImages] = useState({
    logoImage: "",
    bannerImage: "",
  });
  const { logoImage, bannerImage } = formImages;
  const { setCorrectNetwork, setIsWrongNetwork } = useAppContext();
  const [isSuccess, setIsSuccess] = useState<boolean | undefined>(undefined);
  const [formDates, setFormDates] = useState({
    workTimeframeStart: `${cY}-01-01`,
    workTimeframeEnd: currentYear.toISOString().slice(0, 10),
    impactTimeframeStart: `${cY}-01-01`,
    impactTimeframeEnd: currentYear.toISOString().slice(0, 10),
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const { address, chainId } = useWeb3ModalAccount();
  const mychainId = searchParams.get("chainId");
  const roundId = searchParams.get("roundId");
  useEffect(() => {
    (async () => {
      if (address && window.ethereum && mychainId) {
        const walletClient = createWalletClient({
          account: address,
          chain: getChain(Number(mychainId)),
          transport: custom(window.ethereum),
        });
        setWalletCli(walletClient);
        let myClient = new HypercertClient({
          chain: getChain(Number(mychainId)),
          walletClient: walletClient,
          nftStorageToken,
        });
        setClient(myClient);
      }
    })();
  }, [address, nftStorageToken, mychainId]);

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
    contributors: ["john", "ada"],
    rights: ["Public Display"],
    excludedRights: [],
  };
  const myRef = useRef<HTMLDivElement | null>(null);
  const [formValues, setFormValues] = useState<MyMetadata>(initialState);
  const { name, image, description, external_url, impactScope, workScope } =
    formValues;
  const [summedAmountUSD, setSumAmountUSD] = useState<number>(0);
  const [myworkScope, setWorkScopes] = useState<string>("");
  useEffect(() => {
    setAllow(false);
    if (mychainId && roundId) {
      toast.promise(
        (async () => {
          try {
            const res = await axios.get(
              `https://grants-stack-indexer.gitcoin.co/data/${mychainId}/rounds/${roundId}/applications.json`
            );
            const metaData = res.data;
            let raddr = "0x4Be737B450754BC75f1ef0271D3C5dA525173F6b";
            const myItem = [...metaData].find(
              (item) => item.metadata.application.recipient === address
            );
            if (myItem === undefined) {
              throw new Error("Item not found");
            }
            const res2 = await axios.get(
              `https://grants-stack-indexer.gitcoin.co/data/${mychainId}/rounds/${roundId}/contributors.json`
            );
            const projectData = res2.data;
            const contributors: AllowlistEntry[] = [...projectData].map(
              (contributor) => {
                return {
                  address: contributor.id,
                  units: BigInt(Math.floor(contributor.amountUSD)),
                };
              }
            );
            let fal = 0;
            for (let index = 0; index < contributors.length; index++) {
              fal = Number(contributors[index].units) + fal;
            }
            setSumAmountUSD(fal);
            const totalUnits = contributors.map((contri) => {});
            setallowList(contributors);
            setContributorsStored(contributors);
            const options = convertArrayToDisplayText(contributors);
            setContributors(options);

            setFormValues({
              ...formValues,
              name: myItem.metadata.application.project.title,
              external_url: myItem.metadata.application.project.website,
              description: myItem.metadata.application.project.description,
            });
            setFormImages({
              logoImage: `https://ipfs.io/ipfs/${myItem.metadata.application.project.logoImg}`,
              bannerImage: `https://ipfs.io/ipfs/${myItem.metadata.application.project.bannerImg}`,
            });
            //  setWorkScopeStored([myItem.metadata.application.project.title]);
            setAllow(true);
          } catch (err) {
            console.error("Error:", err);
            throw err;
          }
        })(),
        {
          loading: "hypercert is being pre-filled.....",
          success: "Pre-fill Successful",
          error: "You don't have a grant application",
        }
      );
    }
  }, []);

  useEffect(() => {
    if (chainId !== Number(mychainId)) {
      setIsWrongNetwork(true);
      setCorrectNetwork(getChain(Number(mychainId)));
    }
  }, [chainId, mychainId, setCorrectNetwork, setIsWrongNetwork]);

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
  const covertToBlob = async () => {
    const imgBlob = await domtoimage.toBlob(myRef.current as HTMLDivElement);
    return imgBlob;
  };
  const handleRangeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setAllowRange(Number(value));
  };
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsSuccess(undefined);
    event.preventDefault();
    let percentage = allowRange / 100;
    let totalUnits = summedAmountUSD / percentage;
    let recipientUnits = totalUnits - summedAmountUSD;
    console.log("summed amount:", summedAmountUSD);
    console.log("total units:", totalUnits);
    console.log("recipient units:", recipientUnits);

    let newAllowlist: AllowlistEntry[] = [
      ...allowList,
      {
        address: address as string,
        units: BigInt(recipientUnits),
      },
    ];
    if (isValid(formValues) && client) {
      setIsMinting(true);
      try {
        const hyperImage = await covertToBlob();
        if (!hyperImage) {
          throw new Error("Hypercert image is invalid");
        }
        const imgHash = await uploadImage(hyperImage);
        if (!imgHash) {
          throw new Error("Image hash is undefined");
        }
        setFormValues({
          ...formValues,
          image: `https://ipfs.io/ipfs/${imgHash}`,
        });
        console.log("Submit running");
        const res = await MintHypercert(
          formValues,
          client,
          newAllowlist,
          BigInt(totalUnits)
        );

        setIsSuccess(true);
        setIsMinting(false);
      } catch (err) {
        setIsSuccess(false);
        console.error(err);
        throw err;
      }
    }
  };

  const handleDates = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormDates({
      ...formDates,
      [name]: value,
    });
    let newDate = ISOToUNIX(new Date(value));
    setFormValues({
      ...formValues,
      [name]: newDate,
    });
  };
  const diaRef = useRef<HTMLDialogElement | null>(null);

  return (
    <div
      className={`lg:flex md:flex block ${
        allow
          ? "lg:justify-center md:justify-center lg:space-x-[10%] md:space-x-[7%] mx-auto"
          : "lg:justify-center md:justify-center"
      }  h-fit py-[20px] w-full relative`}
    >
      <form
        className={`${
          allow ? "block" : "hidden"
        } p-[40px] lg:w-[45%] md:w-[45%] w-[80%] space-y-3 rounded-[15px] morph lg:mx-0 md:mx-0 mx-auto`}
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
            required
            onChange={handleChange}
            placeholder="The name of your hypercert"
            className={`w-[100%] h-[45px] ps-2 peer bg-white/50 placeholder:text-black/60 rounded-[6px] focus:outline-none text-black`}
          />
          <p className={`text-red-600 italic invisible peer-required:visible`}>
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
          <input
            type="text"
            id="logoImage"
            required
            name="logoImage"
            value={logoImage}
            onChange={handleImages}
            placeholder="Image URL"
            className={`w-[100%] h-[45px] peer ps-2 bg-white/50 placeholder:text-black/60  rounded-[6px] focus:outline-none text-black`}
          />
          <p className={`text-red-600 italic invisible peer-required:visible`}>
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
          <input
            type="text"
            id="bannerImage"
            name="bannerImage"
            value={bannerImage}
            onChange={handleImages}
            placeholder="Banner Image URL"
            className={`w-[100%] h-[45px] ps-2 bg-white/50 placeholder:text-black/60  rounded-[6px] focus:outline-none text-black`}
          />
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
            className={`w-[100%] p-2 peer h-[150px] bg-white/50 placeholder:text-black/60  rounded-[6px] focus:outline-none text-black`}
          ></textarea>
          <p className={`text-red-600 italic invisible peer-required:visible`}>
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
        <fieldset className={`w-[100%]`}>
          <label
            htmlFor="workScope"
            className={`text-white font-bold text-[16px] block mb-1`}
          >
            Work Scope
          </label>
          {/* <CreateSelect
            name="workScope"
            required
            placeholder={`Type something and press enter . . . . . .`}
            value={myworkScope}
            setValue={setWorkScopes}
          /> */}
          <TextArea
            formValues={formValues}
            setFormValues={setFormValues}
            name="workScope"
            displayText={myworkScope}
            setDisplayText={setWorkScopes}
            setStoredValues={setWorkScopeStored}
          />
          <p className={`text-red-600 italic invisible peer-required:visible`}>
            *
          </p>
        </fieldset>
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

        {/* <div className={`w-[100%] rounded-[6px] bg-white/50 text-black p-3`}>
          <div
            className={`flex justify-between hover:cursor-pointer`}
            onClick={() => setIsOpen((prevOpen) => !prevOpen)}
          >
            <p className={`text-[23px] text-violet-800 font-semibold`}>
              Advanced Fields
            </p>

            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 15 12 9 6 15"></polyline>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            )}
          </div>
          <div className={`${isOpen ? "block space-y-2" : "hidden"}`}>
            <p className={`text-[13px] italic text-black`}>
              Advanced fields are currently not available for editing.
            </p>
            <div className={`w-[100%]`}>
              <fieldset className={`w-[100%]`}>
                <label
                  htmlFor="impactScope"
                  className={`text-white font-bold text-[16px] block mb-1`}
                >
                  Impact Scope
                </label>
                <select
                  name="impactScope"
                  id="impactScope"
                  disabled
                  multiple
                  value={impactScope}
                  className={`w-[100%] h-[45px] p-2 bg-white/40 placeholder:text-black/60  rounded-[6px] focus:outline-none border text-black`}
                >
                  <option value="all">All</option>
                </select>
              </fieldset>

              <div
                className={`w-[100%] flex justify-center items-center space-x-2 h-[130px]`}
              >
                <fieldset className={`w-[48%]`}>
                  <label
                    htmlFor="workTimeframeStart"
                    className={`text-white font-bold text-[16px] block mb-1`}
                  >
                    Impact Start Date
                  </label>
                  <input
                    type="date"
                    name="workTimeframeStart"
                    id="workTimeframeStart"
                    value={formDates.impactTimeframeStart}
                    disabled
                    onChange={handleDates}
                    className={`w-[100%] h-[45px] border ps-2 bg-white/40 placeholder:text-black/60  rounded-[6px] focus:outline-none text-black`}
                  />
                </fieldset>
                <fieldset className={`w-[48%]`}>
                  <label
                    htmlFor="workTimeframeEnd"
                    className={`text-white font-bold text-[16px] block mb-1`}
                  >
                    Impact End Date
                  </label>
                  <input
                    type="date"
                    name="workTimeframeEnd"
                    id="workTimeframeEnd"
                    value={formDates.impactTimeframeEnd}
                    onChange={handleDates}
                    disabled
                    className={`w-[100%] h-[45px] border ps-2 bg-white/40 placeholder:text-black/60  rounded-[6px] focus:outline-none text-black`}
                  />
                </fieldset>
              </div>
              <fieldset className={`w-[100%]`}>
                <label
                  htmlFor="rights"
                  className={`text-white font-bold text-[16px] block mb-1`}
                >
                  Usage Rights
                </label>
                <select
                  name="rights"
                  id="rights"
                  disabled
                  multiple
                  value={impactScope}
                  className={`w-[100%] h-[45px] p-2 rounded-[6px] bg-white/40 placeholder:text-black/60  focus:outline-none border text-black`}
                >
                  <option value="Public Display">Public Display</option>
                </select>
                <p
                  className={`text-red-600 italic invisible peer-required:visible`}
                >
                  *
                </p>
              </fieldset>
            </div>
          </div>
        </div> */}
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
              step={0.1}
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
        <HyperCertCard2
          startDate={formDates.workTimeframeStart}
          endDate={formDates.workTimeframeEnd}
          chain={getChain(Number(mychainId))}
          logoImg={logoImage}
          bannerImg={bannerImage}
          roundId={roundId as string}
          name={name}
          workScope={workScopeStored}
          ref={myRef}
        />
      </div>
    </div>
  );
}

export default Page;
