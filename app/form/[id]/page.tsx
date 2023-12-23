function Page() {
  return (
    <div className={`flex justify-center h-fit w-full relative`}>
      <div className={`block p-[40px] w-[37%] space-y-3`}>
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
            className={`w-[100%] p-2 h-[150px] rounded-[6px] focus:outline-none text-black`}
          ></textarea>
        </fieldset>
        <fieldset className={`w-[100%]`}>
          <label
            htmlFor="link"
            className={`text-slate-400 font-bold text-[16px] block mb-1`}
          >
            Link
          </label>
          <input
            type="text"
            id="link"
            name="link"
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
            className={`w-[100%] p-2 h-[150px] rounded-[6px] focus:outline-none text-black`}
          ></textarea>
        </fieldset>
        <div
          className={`w-[100%] flex justify-center items-center space-x-2 h-[130px]`}
        >
          <fieldset className={`w-[48%]`}>
            <label
              htmlFor="workStart"
              className={`text-slate-400 font-bold text-[16px] block mb-1`}
            >
              Work Start Date
            </label>
            <input
              type="date"
              name="workStart"
              id="workStart"
              className={`w-[100%] h-[45px] ps-2 rounded-[6px] focus:outline-none text-black`}
            />
          </fieldset>
          <fieldset className={`w-[48%]`}>
            <label
              htmlFor="workEnd"
              className={`text-slate-400 font-bold text-[16px] block mb-1`}
            >
              Work End Date
            </label>
            <input
              type="date"
              name="workEnd"
              id="workEnd"
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
            className={`w-[100%] p-2 h-[150px] rounded-[6px] focus:outline-none text-black`}
          ></textarea>
        </fieldset>
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
      </div>
      <div
        className={`w-[43%] block h-[100vh] borde sticky top-[100px] p-[40px]`}
      >
        <div
          className={`block w-[300px] h-[390px] border rounded-[12px] mx-auto `}
        ></div>
      </div>
    </div>
  );
}

export default Page;
