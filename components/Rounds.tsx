"use client";

function Rounds() {
  return (
    <div className={`w-full flex justify-center items-center h-fit py-[60px]`}>
      <div
        className={`grid lg:grid-cols-3 md:grid-cols-3 grid-cols-2 gap-[20px]`}
      >
        <div className={`rounded-[12px] h-[350px] w-[350px]`}>
          <div
            className={`h-[40%] p-4 rounded-t-[12px] bg-cover bg-center object-cover backdrop-brightness-[40%] backdrop-blur-md backdrop-filter`}
            style={{
              background: `linear-gradient(to bottom, rgb(0,0,0,0.5) 0%, rgb(0,0,0,0.5) 100%), url("/bg-top.jpg")`,
            }}
          >
            <div className={`flex w-full justify-between`}>
              <p className={`font-bold text-[23px] text-white`}>Round X</p>
              <button
                className={`text-black bg-white text-[11px] rounded-[7px] h-[19px] w-[50px]`}
              >
                Apply
              </button>
            </div>
          </div>
          <div className={`h-[60%] bg-white rounded-b-[12px] p-2`}>
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
