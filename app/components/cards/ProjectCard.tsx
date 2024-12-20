import { DateRange } from "react-day-picker";
import { cn } from "~/lib/utils";
import dayjs from "dayjs";
import { forwardRef, useMemo } from "react";
import { parseListFromString } from "~/lib/parsing";

interface ProjectCardProps {
  name: string;
  bannerImage: string;
  logoImage: string;
  className?: string;
  workTimeFrame?: DateRange;
  workScope?: string;
  shortDescription?: string;
}

const ProjectCard = forwardRef(function (
  {
    name,
    logoImage,
    bannerImage,
    className,
    workTimeFrame,
    workScope,
    shortDescription,
  }: ProjectCardProps,
  ref?
) {
  const workTags = useMemo(() => {
    if (workScope) {
      return parseListFromString(workScope);
    }
  }, [workScope]);
  return (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(
        "flex flex-col min-w-[260px] max-w-[300px] relative w-[330px] h-[380px] rounded-[12px] lg:mx-0 md:mx-0 mx-auto bg-black",
        className
      )}
    >
      <div
        className={`w-[40px] h-[40px] absolute left-3 top-3 bg-cover bg-center rounded-full`}
        style={{ backgroundImage: logoImage ? `url("${logoImage}")` : "none" }}
      />
      <div
        className={`w-full h-[35%] border border-neutral-600 rounded-[12px] p-3 bg-cover bg-center bg-no-repeat`}
        style={{
          backgroundImage: bannerImage ? `url(${bannerImage})` : "none",
        }}
      ></div>
      <div
        className={`flex-1 bg-white p-3 rounded-[12px] border border-neutral-600`}
      >
        <div className={`min-h-[90px]`}>
          <p className={`font-bold text-[20px] text-neutral-700`}>{name}</p>
          {shortDescription && (
            <p className={`text-[12px] text-neutral-600 py-[2px]`}>
              {shortDescription}
            </p>
          )}
        </div>
        <div className="h-px bg-neutral-600 mt-[50px]" />
        <div className={`flex justify-between w-full`}>
          <div className={`block`}>
            <p className={`font-semibold text-[13px] text-neutral-700`}>Work</p>
          </div>
          <div className={`flex items-center space-x-[6px] font-semibold`}>
            <p className={`text-[13px] text-neutral-700`}>
              {workTimeFrame
                ? dayjs(workTimeFrame.from).format("MMM D, YYYY")
                : dayjs().format("MMM D, YYYY")}
            </p>
            <p className={`text-[13px] text-neutral-700 space-x-1`}>&rarr; </p>
            <p className={`text-[13px] text-neutral-700`}>
              {workTimeFrame
                ? dayjs(workTimeFrame.to).format("MMM D, YYYY")
                : dayjs().format("MMM D, YYYY")}
            </p>
          </div>
        </div>
        <div className={`flex w-full flex-wrap py-[20px] gap-[6px]`}>
          {workTags &&
            workTags.map((v, i) => (
              <div
                key={i}
                className={`border rounded-[6px] truncate min-w-[40px] max-w-[65px] h-[19px] px-[6px] inline-flex justify-center items-center border-black text-[12px]`}
              >
                <p className="text-[12px] m-0">{v}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
});

export default ProjectCard;
