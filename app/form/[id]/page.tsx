"use client";

import { MyMetadata } from "@/actions/hypercerts";
import { HypercertClient } from "@hypercerts-org/sdk";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useState, useRef, useEffect } from "react";
import { goerli } from "viem/chains";
import { createWalletClient, custom, http } from "viem";
declare let window: any;

let currentYear = new Date();
let cY = currentYear.getFullYear();

function Page() {
  const nftStorageToken = process.env.NEXT_PUBLIC_NFTSTORAGE;
  console.log(nftStorageToken);
  const [hyperCertModule, setHyperCertModule] = useState<
    typeof import("@/actions/hypercerts") | undefined
  >(undefined);
  const [client, setClient] = useState<HypercertClient | undefined>(undefined);
  const { address } = useWeb3ModalAccount();

  useEffect(() => {
    (async () => {
      const Hypercerts = await import("@/actions/hypercerts");
      setHyperCertModule(Hypercerts);
      if (address && window.ethereum) {
        const walletClient = createWalletClient({
          account: address,
          chain: goerli,
          transport: custom(window.ethereum),
        });
        let myClient = new HypercertClient({
          chain: goerli,
          walletClient: walletClient,
          nftStorageToken,
          web3StorageToken: nftStorageToken,
        });
        setClient(myClient);
      }
    })();
  }, [address, nftStorageToken]);

  const [formDates, setFormDates] = useState({
    workTimeframeStart: `${cY}-01-01`,
    workTimeframeEnd: currentYear.toISOString().slice(0, 10),
    impactTimeframeStart: `${cY}-01-01`,
    impactTimeframeEnd: currentYear.toISOString().slice(0, 10),
  });

  const initialState: MyMetadata = {
    name: "HyperCert 1",
    description: "This is a test",
    external_url: "https://999.com",
    image: "https://999.com",
    version: "1.0",
    properties: undefined,
    impactScope: ["All"],
    excludedImpactScope: [],
    workScope: ["Defi", "Test"],
    excludedWorkScope: [],
    workTimeframeStart: Date.parse(formDates.workTimeframeStart),
    workTimeframeEnd: Date.parse(formDates.workTimeframeEnd),
    impactTimeframeStart: Date.parse(formDates.impactTimeframeStart),
    impactTimeframeEnd: Date.parse(formDates.impactTimeframeEnd),
    contributors: ["0xb2403f83C23748b26B06173db7527383482E8c5a"],
    rights: ["Public Display"],
    excludedRights: [],
  };
  const [formValues, setFormValues] = useState<MyMetadata>(initialState);
  const [isOpen, setIsOpen] = useState(false);
  const [hash, setHash] = useState<`0x${string}` | string>("");
  const {
    name,
    image,
    description,
    external_url,
    workScope,
    impactScope,
    rights,
    contributors,
  } = formValues;
  const isValid = (formValue: MyMetadata) => {
    const {
      name,
      image,
      description,
      external_url,
      workScope,
      impactScope,
      rights,
      contributors,
      workTimeframeEnd,
      workTimeframeStart,
      impactTimeframeEnd,
      impactTimeframeStart,
      version,
    } = formValue;
    return (
      name !== "" &&
      description !== "" &&
      workScope.length &&
      contributors.length &&
      rights.length &&
      workTimeframeEnd &&
      workTimeframeStart &&
      image !== "" &&
      impactScope.length &&
      impactTimeframeEnd &&
      impactTimeframeStart &&
      version !== ""
    );
  };
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const handleScopes = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    const wrds = value.split(",");
    setFormValues({
      ...formValues,
      [name]: wrds,
    });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newCont = contributors.map((person) => person.trim());
    const nwrds = workScope.map((wrd) => wrd.trim());
    setFormValues({
      ...formValues,
      workScope: nwrds,
      contributors: newCont,
    });
    if (isValid(formValues) && diaRef.current && hyperCertModule && client) {
      diaRef.current.showModal();
      const res = await hyperCertModule.MintHypercert(formValues, client);
      setHash(res as `0x${string}`);
      setTimeout(() => {
        diaRef.current?.close();
      }, 10000);
      setHash("");
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

  return (
    <div className={`flex justify-center h-fit w-full relative`}>
      <form className={`block p-[40px] w-[43%] space-y-3`} onSubmit={onSubmit}>
        <hr />
        <p className={`text-[23px]`}>General Fields</p>
        <fieldset className={`w-[100%]`}>
          <label
            htmlFor="name"
            className={`text-slate-400 font-bold text-[16px] block mb-1`}
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
            className={`w-[100%] h-[45px] ps-2 peer rounded-[6px] focus:outline-none text-black`}
          />
          <p className={`text-red-600 italic invisible peer-required:visible`}>
            *
          </p>
        </fieldset>
        <fieldset className={`w-[100%]`}>
          <label
            htmlFor="image"
            className={`text-slate-400 font-bold text-[16px] block mb-1`}
          >
            Logo Image
          </label>
          <input
            type="text"
            id="image"
            required
            name="image"
            value={image}
            onChange={handleChange}
            placeholder="Image URL"
            className={`w-[100%] h-[45px] peer ps-2 rounded-[6px] focus:outline-none text-black`}
          />
          <p className={`text-red-600 italic invisible peer-required:visible`}>
            *
          </p>
        </fieldset>
        <fieldset className={`w-[100%]`}>
          <label
            htmlFor="banner"
            className={`text-slate-400 font-bold text-[16px] block mb-1`}
          >
            Banner Image
          </label>
          <input
            type="text"
            id="banner"
            name="banner"
            placeholder="Banner Image URL"
            className={`w-[100%] h-[45px] ps-2 rounded-[6px] focus:outline-none text-black`}
          />
        </fieldset>
        <fieldset className={`w-[100%]`}>
          <label
            htmlFor="description"
            className={`text-slate-400 font-bold text-[16px] block mb-1`}
          >
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={description}
            required
            onChange={handleChange}
            className={`w-[100%] p-2 peer h-[150px] rounded-[6px] focus:outline-none text-black`}
          ></textarea>
          <p className={`text-red-600 italic invisible peer-required:visible`}>
            *
          </p>
        </fieldset>
        <fieldset className={`w-[100%]`}>
          <label
            htmlFor="external_url"
            className={`text-slate-400 font-bold text-[16px] block mb-1`}
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
            className={`w-[100%] h-[45px] ps-2 rounded-[6px] focus:outline-none text-black`}
          />
        </fieldset>
        <hr />
        <p className={`text-[23px]`}>Hypercert Fields</p>
        <fieldset className={`w-[100%]`}>
          <label
            htmlFor="workScope"
            className={`text-slate-400 font-bold text-[16px] block mb-1`}
          >
            Work Scope
          </label>
          <textarea
            name="workScope"
            id="workScope"
            value={workScope}
            onChange={handleScopes}
            required
            placeholder="WorkScope1, WorkScope2"
            className={`w-[100%] p-2 h-[150px] peer rounded-[6px] focus:outline-none text-black`}
          ></textarea>
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
              className={`text-slate-400 font-bold text-[16px] block mb-1`}
            >
              Work Start Date
            </label>
            <input
              type="date"
              name="workTimeframeStart"
              id="workTimeframeStart"
              value={formDates.workTimeframeStart}
              onChange={handleDates}
              className={`w-[100%] h-[45px] ps-2 rounded-[6px] focus:outline-none text-black`}
            />
          </fieldset>
          <fieldset className={`w-[48%]`}>
            <label
              htmlFor="workTimeframeEnd"
              className={`text-slate-400 font-bold text-[16px] block mb-1`}
            >
              Work End Date
            </label>
            <input
              type="date"
              name="workTimeframeEnd"
              id="workTimeframeEnd"
              value={formDates.workTimeframeEnd}
              onChange={handleDates}
              className={`w-[100%] h-[45px] ps-2 rounded-[6px] focus:outline-none text-black`}
            />
          </fieldset>
        </div>
        <fieldset className={`w-[100%]`}>
          <label
            htmlFor="contributors"
            className={`text-slate-400 font-bold text-[16px] block mb-1`}
          >
            List of contributors
          </label>
          <textarea
            name="contributors"
            id="contributors"
            value={contributors}
            onChange={handleScopes}
            required
            placeholder="0xWalletAddress1, 0xWalletAddress2"
            className={`w-[100%] p-2 h-[150px] peer rounded-[6px] focus:outline-none text-black`}
          ></textarea>
          <p className={`text-red-600 italic invisible peer-required:visible`}>
            *
          </p>
        </fieldset>
        <div className={`w-[100%] rounded-[6px] bg-white text-black p-3`}>
          <div
            className={`flex justify-between hover:cursor-pointer`}
            onClick={() => setIsOpen((prevOpen) => !prevOpen)}
          >
            <p className={`text-[23px]`}>Advanced Fields</p>

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
            <p className={`text-[13px] italic text-slate-400`}>
              Advanced fields are currently not available for editing.
            </p>
            <div className={`w-[100%]`}>
              <fieldset className={`w-[100%]`}>
                <label
                  htmlFor="impactScope"
                  className={`text-slate-400 font-bold text-[16px] block mb-1`}
                >
                  Impact Scope
                </label>
                <select
                  name="impactScope"
                  id="impactScope"
                  disabled
                  multiple
                  value={impactScope}
                  className={`w-[100%] h-[45px] p-2 rounded-[6px] focus:outline-none border text-black`}
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
                    className={`text-slate-400 font-bold text-[16px] block mb-1`}
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
                    className={`w-[100%] h-[45px] border ps-2 rounded-[6px] focus:outline-none text-black`}
                  />
                </fieldset>
                <fieldset className={`w-[48%]`}>
                  <label
                    htmlFor="workTimeframeEnd"
                    className={`text-slate-400 font-bold text-[16px] block mb-1`}
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
                    className={`w-[100%] h-[45px] border ps-2 rounded-[6px] focus:outline-none text-black`}
                  />
                </fieldset>
              </div>
              <fieldset className={`w-[100%]`}>
                <label
                  htmlFor="rights"
                  className={`text-slate-400 font-bold text-[16px] block mb-1`}
                >
                  Usage Rights
                </label>
                <select
                  name="rights"
                  id="rights"
                  disabled
                  multiple
                  value={impactScope}
                  className={`w-[100%] h-[45px] p-2 rounded-[6px] focus:outline-none border text-black`}
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
        <p className={`text-[23px]`}>Distribution</p>
        <fieldset className={`w-[100%]`}>
          <label
            htmlFor="allowList"
            className={`text-slate-400 font-bold text-[16px] block mb-1`}
          >
            Allow List
          </label>
          <input
            type="text"
            id="allowList"
            name="allowList"
            placeholder="https://project.org/allowlist.csv"
            className={`w-[100%] h-[45px] ps-2 rounded-[6px] focus:outline-none text-black`}
          />
        </fieldset>
        <fieldset className={`w-[100%]`}>
          <label
            htmlFor="distribution"
            className={`text-slate-400 font-bold text-[16px] block mb-1`}
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
      <div
        className={`w-[40%] block h-[100vh] borde sticky top-[100px] p-[40px]`}
      >
        <div
          className={`block w-[300px] h-[390px] border rounded-[12px] mx-auto `}
        ></div>
      </div>
      <dialog
        ref={diaRef}
        className={`backdrop:bg-neutral-900/90 w-[50%] fixed translate-y-[-50%] top-[50%] h-[50%] border-0 rounded-[6px] p-[20px] inset-0 backdrop-blur z-[30]`}
      >
        <div className={`bg-white text-black`}>
          <p>The transaction hash: {hash}</p>
        </div>
      </dialog>
    </div>
  );
}

export default Page;
