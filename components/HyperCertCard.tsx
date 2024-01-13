interface HyperCertCardProps {
  name: string;
  logoImg: string;
  bannerImg: string;
}

function HyperCertCard({ name, bannerImg, logoImg }: HyperCertCardProps) {
  return (
    <div
      className={`block w-[300px] h-[380px] rounded-[12px] p-3`}
      id="hypercert"
      style={{
        background: `linear-gradient(
        to bottom,
        rgba(88, 28, 135, 0.4) 0%,
        rgba(147, 51, 234, 0.5) 35%,
        rgba(88, 28, 135) 100%
      ),
      url("/svg/black.png") center/cover repeat, url("${bannerImg}") center/300px 380px no-repeat`,
      }}
    >
      <div
        className={`w-[40px] h-[40px] bg-cover rounded-full bg-white`}
        style={{ backgroundImage: `url("${logoImg}")` }}
      ></div>
      <div
        className={`mt-[30%] w-full space-y-4 min-h-[130px] flex items-center border-t-[2px] border-b`}
      >
        <p className={`text-[20px] text-white font-bold`}>{name}</p>
      </div>
      <div className={`flex justify-between w-full pt-2 text-white`}>
        <div className={`block`}>
          <p className={`font-bold text-[13px]`}>IMPACT</p>
          <div className={`grid grid-cols-2 gap-2`}></div>
        </div>
        <div className={`flex items-cente`}>
          <p className={`text-[14px]`}>work-start</p>
          <p className={`text-[13px] space-x-1`}>&rarr;</p>
          <p className={`text-[14px]`}>work-end</p>
        </div>
      </div>
    </div>
  );
}

export default HyperCertCard;
