import { useForm, SubmitHandler } from "react-hook-form";
import { Progress } from "~/components/ui/progress";

type Inputs = {
  title: string;
  description: string;
  link?: string;
  logo: string;
  bannerImage: string;
};
function FormComponent() {
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);
  const {
    register,
    handleSubmit,
    // watch,
    // formState: { errors },
  } = useForm<Inputs>();

  return (
    <div className={`w-[500px] block mt-[20px]`}>
      <div className={`w-full h-fit space-y-3`}>
        <Progress value={33} className={`w-[95%] block mx-auto h-[8px]`} />
        <div className={`flex items-center justify-between px-[30px]`}>
          <div className={`inline-flex items-center gap-x-3`}>
            <div
              className={`flex justify-center items-center w-[30px] h-[25px] rounded-[8px] border`}
            >
              <p className={`text-[14px] text-[#778599]`}>1</p>
            </div>
            <p className={`text-[16px] text-[#778599]`}>General</p>
          </div>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`w-full p-3 space-y-5 mt-[40px]`}
      >
        <fieldset className={`w-full space-y-1`}>
          <label htmlFor="title" className={`text-[15px] font-bold`}>
            Title
          </label>
          <input
            {...register("title", { required: true })}
            className={`w-full h-[40px] rounded-lg border px-2`}
          />
          <p className={`text-[#778599] text-[13px]`}>
            Keep it short but descriptive
          </p>
        </fieldset>
        <fieldset className={`w-full space-y-1`}>
          <label htmlFor="description" className={`text-[15px] font-bold`}>
            Description
          </label>
          <textarea
            {...register("description", { required: true })}
            className={`w-full h-[90px] rounded-lg border p-2`}
          />
          <p className={`text-[#778599] text-[13px]`}>
            Describe your project: why it was created, and how it works
          </p>
        </fieldset>
        <fieldset className={`w-full space-y-1`}>
          <label htmlFor="link" className={`text-[15px] font-bold`}>
            Link (optional)
          </label>
          <input
            placeholder="https://"
            {...register("link")}
            className={`w-full h-[40px] rounded-lg border px-2`}
          />
          <p className={`text-[#778599] text-[13px]`}>
            Paste a link to your impact report or your project
          </p>
        </fieldset>
        <fieldset className={`w-full space-y-1`}>
          <label htmlFor="logo" className={`text-[15px] font-bold`}>
            Logo
          </label>
          <input
            placeholder="https://"
            {...register("logo")}
            className={`w-full h-[40px] rounded-lg border px-2`}
          />
          <p className={`text-[#778599] text-[13px]`}>
            The URL to your project logo
          </p>
        </fieldset>
        <fieldset className={`w-full space-y-1`}>
          <label htmlFor="bannerImage" className={`text-[15px] font-bold`}>
            Banner image
          </label>
          <input
            placeholder="https://"
            {...register("bannerImage")}
            className={`w-full h-[40px] rounded-lg border px-2`}
          />
          <p className={`text-[#778599] text-[13px]`}>
            The URL to an image to be displayed as the banner
          </p>
        </fieldset>
      </form>
    </div>
  );
}
export default FormComponent;
