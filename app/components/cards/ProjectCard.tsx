import { DateRange } from "react-day-picker";
import { cn } from "~/lib/utils";
import dayjs from "dayjs";

interface ProjectCardProps {
  name: string;
  bannerImage: string;
  logoImage: string;
  className?: string;
  workTimeFrame?: DateRange;
}

function ProjectCard({
  name,
  logoImage,
  bannerImage,
  className,
  workTimeFrame,
}: ProjectCardProps) {
  const { to, from } = workTimeFrame!;
  const tags = [name];
  return (
    <div
      className={cn(
        "block min-w-[260px] max-w-[300px] relative w-[330px] h-[380px] rounded-[12px] lg:mx-0 md:mx-0 mx-auto bg-black",
        className
      )}
    >
      <div
        className={`w-[40px] h-[40px] absolute left-3 top-3 bg-cover bg-center rounded-full`}
        style={{ backgroundImage: `url("${logoImage}")` }}
      />
      <div
        className={`w-full h-[45%] border border-neutral-600 rounded-[12px] p-3 bg-cover bg-center bg-no-repeat`}
        style={{ backgroundImage: `url(${bannerImage})` }}
      ></div>
      <div
        className={`h-[55%] bg-white p-3 rounded-[12px] border border-neutral-600`}
      >
        <p className={`font-bold text-[20px] text-neutral-700`}>{name}</p>
        <div className="h-px bg-neutral-600 mt-[50px]" />
        <div className={`flex justify-between w-full`}>
          <div className={`block`}>
            <p className={`font-semibold text-[13px] text-neutral-700`}>Work</p>
          </div>
          <div className={`flex items-center space-x-[6px] font-semibold`}>
            <p className={`text-[13px] text-neutral-700`}>
              {dayjs(from).format("MMM D, YYYY") ||
                dayjs().format("MMM D, YYYY")}
            </p>
            <p className={`text-[13px] text-neutral-700 space-x-1`}>&rarr; </p>
            <p className={`text-[13px] text-neutral-700`}>
              {dayjs(to).format("MMM D, YYYY") || dayjs().format("MMM D, YYYY")}
            </p>
          </div>
        </div>
        <div className={`flex w-full flex-wrap mt-[20px] gap-[6px]`}>
          {tags.map((v, i) => (
            <div
              key={i}
              className={`border rounded-[6px] truncate w-fit max-w-[65px] h-fit px-[6px] py-[2px] inline-block border-black items-center text-[12px]`}
            >
              {v}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
