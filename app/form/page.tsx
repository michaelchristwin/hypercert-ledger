"use client";

import {
  MyMetadata,
  MintHypercert,
  ISOToUNIX,
  isValid,
} from "@/actions/hypercerts";
import { HypercertClient } from "@hypercerts-org/sdk";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useState, useRef, useEffect } from "react";
import { createWalletClient, custom, WalletClient } from "viem";
import { useSearchParams } from "next/navigation";
import { goerli } from "viem/chains";
import CreateSelect, { Option } from "@/components/CreateableSelect";
import toast from "react-hot-toast";
import { useScreenshot } from "use-react-screenshot";
import Image from "next/image";
declare let window: any;

let currentYear = new Date();
let cY = currentYear.getFullYear();

function Page() {
  const nftStorageToken = process.env.NEXT_PUBLIC_NFTSTORAGE;
  const searchParams = useSearchParams();
  const hypercertRef = useRef<HTMLDivElement | null>(null);
  const [img, takeScreenshot] = useScreenshot();
  const getImage = () => takeScreenshot(hypercertRef.current);
  const [client, setClient] = useState<HypercertClient | undefined>(undefined);
  const [walletCli, setWalletCli] = useState<WalletClient | undefined>(
    undefined
  );
  const [myworkScope, setWorkScopes] = useState<readonly Option[]>([]);
  const [myContributors, setContributors] = useState<readonly Option[]>([]);
  const [formImages, setFormImages] = useState({
    logoImage: "",
    bannerImage: "",
  });
  const { logoImage, bannerImage } = formImages;
  const [isSuccess, setIsSuccess] = useState<boolean | undefined>(undefined);
  const [formDates, setFormDates] = useState({
    workTimeframeStart: `${cY}-01-01`,
    workTimeframeEnd: currentYear.toISOString().slice(0, 10),
    impactTimeframeStart: `${cY}-01-01`,
    impactTimeframeEnd: currentYear.toISOString().slice(0, 10),
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const { address } = useWeb3ModalAccount();
  const chainId = searchParams.get("chainId");
  const roundId = searchParams.get("roundId");
  const projectId = searchParams.get("projectId");
  useEffect(() => {
    (async () => {
      if (address && window.ethereum && chainId) {
        const walletClient = createWalletClient({
          account: address,
          chain: goerli,
          transport: custom(window.ethereum),
        });
        setWalletCli(walletClient);
        let myClient = new HypercertClient({
          chain: goerli,
          walletClient: walletClient,
          nftStorageToken,
          web3StorageToken: nftStorageToken,
        });
        setClient(myClient);
      }
    })();
  }, [address, nftStorageToken, chainId]);

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
  const { name, image, description, external_url, impactScope } = formValues;

  useEffect(() => {
    if (chainId && roundId && projectId) {
      toast.promise(
        (async () => {
          const res = await fetch(
            `https://grants-stack-indexer.gitcoin.co/data/${chainId}/rounds/${roundId}/applications.json`
          );
          const data = await res.json();
          const myItem = data.find((item: any) => item.projectId === projectId);
          setFormValues({
            ...formValues,
            name: myItem.metadata.application.project.title,
            external_url: myItem.metadata.application.project.website,
            description: myItem.metadata.application.project.description,
          });
          setFormImages({
            logoImage: `https://ipfs.io/ipfs/${myItem.metadata.application.project.logoImg}`,
            bannerImage: ``,
          });
        })(),
        {
          loading: "hypercert is being pre-filled.....",
          success: "Pre-fill Successful",
          error: "Error when fetching data",
        }
      );
    }
    //@ts-ignore
  }, []);

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
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsSuccess(undefined);
    event.preventDefault();
    const Contributors = myContributors.map((item) => item.value);
    const WorkScopes = myworkScope.map((item) => item.value);

    setFormValues({
      ...formValues,
      workScope: WorkScopes,
      contributors: Contributors,
    });

    if (isValid(formValues) && diaRef.current && client) {
      setIsMinting(true);
      try {
        diaRef.current.showModal();
        const res = await MintHypercert(formValues, client);
        setIsSuccess(true);
        setIsMinting(false);
      } catch (err) {
        setIsSuccess(false);
        console.error("Mint Failed:", err);
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
    let newDate = Date.parse(value);
    setFormValues({
      ...formValues,
      [name]: newDate,
    });
  };
  const diaRef = useRef<HTMLDialogElement | null>(null);
  console.log(img);
  return (
    <div className={`flex justify-center h-fit py-[20px] w-full relative`}>
      <form
        className={`block p-[40px] w-[43%] space-y-3 rounded-[15px] morph`}
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
          <CreateSelect
            name="workScope"
            required
            placeholder={`Type something and press enter . . . . . .`}
            value={myworkScope}
            setValue={setWorkScopes}
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
        <fieldset className={`w-[100%]`}>
          <label
            htmlFor="contributors"
            className={`text-white font-bold text-[16px] block mb-1`}
          >
            List of contributors
          </label>
          <CreateSelect
            name="contributors"
            required
            placeholder={`Type something and press enter . . . . . .`}
            value={myContributors}
            setValue={setContributors}
          />

          <p className={`text-red-600 italic invisible peer-required:visible`}>
            *
          </p>
        </fieldset>
        <div className={`w-[100%] rounded-[6px] bg-white/50 text-black p-3`}>
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
        </div>
        <hr />
        <p className={`text-[23px] text-violet-800 font-semibold`}>
          Distribution
        </p>
        <fieldset className={`w-[100%]`}>
          <label
            htmlFor="allowList"
            className={`text-white font-bold text-[16px] block mb-1`}
          >
            Allow List
          </label>
          <input
            type="text"
            id="allowList"
            name="allowList"
            placeholder="https://project.org/allowlist.csv"
            className={`w-[100%] h-[45px] ps-2 rounded-[6px] bg-white/50 placeholder:text-black/60  focus:outline-none text-black`}
          />
        </fieldset>
        <fieldset className={`w-[100%]`}>
          <label
            htmlFor="distribution"
            className={`text-white font-bold text-[16px] block mb-1`}
          >
            Percentage distributed via allow List
          </label>
          <input
            type="range"
            min={1}
            max={100}
            disabled
            name="distribution"
            id="distribution"
            className={`w-[100%] border-0 bg-white outline-none`}
          />
        </fieldset>

        <button
          type="submit"
          className={`px-1 border w-[100px] bg-white text-black hover:opacity-75 active:opacity-60 rounded-lg mx-auto h-[35px] block`}
        >
          Create
        </button>
      </form>
      <div className={`w-[40%] block h-[100vh] sticky top-[100px] p-[40px]`}>
        <div
          className={`block w-[290px] h-[370px] rounded-[12px] p-3 mx-auto`}
          ref={hypercertRef}
          style={{
            background: `linear-gradient(
              to bottom,
              rgba(88, 28, 135, 0.9) 0%,
              rgba(147, 51, 234, 0.9) 35%,
              rgba(216, 180, 254, 0.9) 100%
            ),
            url("/svg/black.png") center/cover repeat, url("${bannerImage}") center/contain no-repeat`,
          }}
        >
          <div
            className={`w-[40px] h-[40px] bg-cover rounded-full bg-white`}
            style={{ backgroundImage: `url("${logoImage}")` }}
          ></div>
          <div
            className={`mt-[30%] w-full space-y-4 min-h-[130px] flex items-center border-t-[2px] border-b`}
          >
            <p className={`text-[20px] text-gray-700 font-bold`}>{name}</p>
          </div>
          <div className={`flex justify-between w-full pt-2`}>
            <div className={`block`}>
              <p className={`font-bold text-[13px] text-gray-700`}>IMPACT</p>
              <div className={`grid grid-cols-2 gap-2`}>
                {myworkScope.map((item, index) => (
                  <div
                    key={index}
                    className={`border-[2px] border-gray-600 flex justify-around rounded-[4px] min-w-[10px] h-[20px] px-2`}
                  >
                    <p className={`text-[12px] text-center`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className={`flex items-cente`}>
              <p className={`text-[14px]`}>{formDates.impactTimeframeStart}</p>
              <p className={`text-[13px] space-x-1`}>&rarr;</p>
              <p className={`text-[14px]`}>{formDates.workTimeframeEnd}</p>
            </div>
          </div>
        </div>
        {/* <button className={`bg-white rounded`} onClick={getImage} type="button">
          Capture
        </button>
        <Image alt="capture" width={40} height={60} src={img} /> */}
      </div>
      <dialog
        ref={diaRef}
        className={`backdrop:bg-neutral-900/90 w-[50%] fixed translate-y-[-50%] top-[50%] h-[50%] border-0 rounded-[6px] p-[20px] inset-0 backdrop-blur z-[30]`}
      >
        <div
          className={`bg-white text-black text-center relative flex w-full justify-center items-center h-full`}
        >
          <p className={`text-[20px] absolute top-[6px] font-bold`}>
            Processing Hypercert...
          </p>
          {!isMinting && (
            <button
              className={`absolute top-[6px] right-[6px]`}
              onClick={() => diaRef.current?.close()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
          {isMinting ? (
            <div className={`loading-container`}>
              <div className={`loading`}></div>
              {/* <div
              className={`loading-text translate-y-[-50%] left-[50%] translate-x-[-50%]`}
            >
              Minting
            </div> */}
            </div>
          ) : (
            <div
              className={`w-[150px] h-[150px] rounded-full bg-green-500 flex justify-center cali scale-[0.84] items-center animate-animateContainer`}
            >
              <svg
                viewBox="0 0 65 51"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                height={80}
                width={80}
                className={`animate-animateCheck cali`}
              >
                <path
                  d="M7 25L27.3077 44L58.5 7"
                  stroke="white"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      </dialog>
    </div>
  );
}

export default Page;
