"use client";

function Rounds() {
  return (
    <div className={`w-full flex justify-center items-center h-[70vh]`}>
      <div className={`grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2`}>
        <div className={`rounded-[12px] h-[350px] w-[350px] morph`}>
          <div className={`h-[30%]`}></div>
          <div className={`h-[70%] bg-white rounded-b-[12px] p-2`}>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsum,
              doloribus nihil nam ea at suscipit magnam. Impedit, tempore culpa
              eveniet molestiae nesciunt, numquam dignissimos provident cum
              labore soluta deserunt libero?
            </p>
          </div>
        </div>
        <div className={`rounded-[12px] h-[350px] w-[350px] morph`}></div>
        <div className={`rounded-[12px] h-[350px] w-[350px] morph`}></div>
        <div className={`rounded-[12px] h-[350px] w-[350px] morph`}></div>
      </div>
    </div>
  );
}

export default Rounds;
