"use client";

import { MyMetadata } from "@/actions/hypercerts";
import { useState } from "react";

const initialState: MyMetadata = {
  name: "",
  description: "",
  external_url: undefined,
  image: "",
  version: "",
  properties: undefined,
  impactScope: [],
  excludedImpactScope: [],
  workScope: [],
  excludedWorkScope: [],
  workTimeframeStart: 0,
  workTimeframeEnd: 0,
  impactTimeframeStart: 0,
  impactTimeframeEnd: 0,
  contributors: [],
  rights: ["Public Display"],
  excludedRights: [],
};

function Page() {
  const [formValues, setFormValues] = useState<MyMetadata>(initialState);
  const [isOpen, setIsOpen] = useState(false);
  const [formDates, setFormDates] = useState({
    workTimeframeStart: "",
    workTimeframeEnd: "",
  });
  const {
    name,
    image,
    description,
    external_url,
    workScope,
    workTimeframeEnd,
    workTimeframeStart,
    contributors,
  } = formValues;
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
    //console.log(formValues);
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
  const collector = (data: MyMetadata) => {
    console.log(data);
  };
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newCont = contributors.map((person) => person.trim());
    const nwrds = workScope.map((wrd) => wrd.trim());
    collector({
      ...formValues,
      workScope: nwrds,
      contributors: newCont,
    });
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
  return (
    <div className={`flex justify-center h-fit w-full relative`}>
      <form className={`block p-[40px] w-[50%] space-y-3`} onSubmit={onSubmit}>
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
            onChange={handleChange}
            placeholder="The name of your hypercert"
            className={`w-[100%] h-[45px] ps-2 rounded-[6px] focus:outline-none text-black`}
          />
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
            name="image"
            value={image}
            onChange={handleChange}
            placeholder="Image URL"
            className={`w-[100%] h-[45px] ps-2 rounded-[6px] focus:outline-none text-black`}
          />
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
            onChange={handleChange}
            className={`w-[100%] p-2 h-[150px] rounded-[6px] focus:outline-none text-black`}
          ></textarea>
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
            className={`w-[100%] p-2 h-[150px] rounded-[6px] focus:outline-none text-black`}
          ></textarea>
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
            className={`w-[100%] p-2 h-[150px] rounded-[6px] focus:outline-none text-black`}
          ></textarea>
        </fieldset>
        <div className={`w-[100%] rounded-[6px] bg-white text-black p-3`}>
          <div
            className={`flex justify-between`}
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
            <fieldset className={`w-[100%]`}>
              <label
                htmlFor="external_url"
                className={`text-slate-400 font-bold text-[16px] block mb-1`}
              >
                Link
              </label>
              <select
                name="all"
                id="all"
                disabled
                className={`w-[100%] h-[45px] px-3 rounded-[6px] focus:outline-none border text-black`}
              >
                <option value="all">All</option>
              </select>
            </fieldset>
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
            name="distribution"
            id="distribution"
            className={`w-[100%] border-0 bg-white outline-none`}
          />
        </fieldset>
        <button
          type="submit"
          className={`px-1 border rounded-lg mx-auto h-[37px] block`}
        >
          Submit
        </button>
      </form>
      <div
        className={`w-[40%] block h-[100vh] borde sticky top-[100px] p-[40px]`}
      >
        <div
          className={`block w-[300px] h-[390px] border rounded-[12px] mx-auto `}
        ></div>
      </div>
    </div>
  );
}

export default Page;
