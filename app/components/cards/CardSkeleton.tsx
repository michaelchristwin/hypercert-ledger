import { Skeleton } from "~/components/ui/skeleton";

function CardSkeleton() {
  return (
    <div
      className={`block min-w-[260px] border max-w-[300px] relative w-[330px] h-[380px] rounded-[12px] lg:mx-0 md:mx-0 mx-auto`}
    >
      <Skeleton
        className={`w-[40px] h-[40px] absolute left-3 custom-skeleton top-3  rounded-full`}
      />
      <div className={`w-full h-[45%] border rounded-[12px] p-3`}></div>
      <div className={`h-[55%] p-3 rounded-[12px] border`}>
        <Skeleton
          className={`w-[90%] rounded-[8px] h-[25px] custom-skeleton`}
        />
        <Skeleton className="h-px mt-[50px] custom-skeleton" />
        <div className={`flex justify-between w-full`}>
          <div className={`block`}>
            <Skeleton
              className={`w-[50px] mt-1 rounded-[8px] h-[13px] custom-skeleton`}
            />
            <div className={`grid grid-cols-2 gap-2`}></div>
          </div>
          <Skeleton
            className={`flex items-center w-[200px] rounded-[8px] mt-1 font-semibold custom-skeleton`}
          />
        </div>
        <div className={`flex w-full flex-wrap mt-[20px] gap-[6px]`}>
          {[1, 2, 3, 4].map((_, i) => (
            <Skeleton
              key={i}
              className={`custom-skeleton w-[50px] h-[15px] rounded-[6px]`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CardSkeleton;
