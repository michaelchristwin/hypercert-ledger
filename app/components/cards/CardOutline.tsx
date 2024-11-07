function CardOutline({ msg }: { msg?: string }) {
  return (
    <div
      className={`block min-w-[260px] border max-w-[300px] relative w-[330px] h-[380px] rounded-[12px] lg:mx-0 md:mx-0 mx-auto`}
    >
      <div className={`w-full h-[45%] border rounded-[12px] p-3`}></div>
      <div className={`h-[55%] p-3 rounded-[12px] border`}>
        <p className={`font-bold text-[20px] text-neutral-700`}>{msg}</p>
        <div className="h-px bg-neutral-700 mt-[60px]" />
      </div>
    </div>
  );
}
export default CardOutline;
