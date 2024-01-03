function Navbar() {
  return (
    <nav
      className={`flex w-[100vw] h-[90px] px-9 items-center justify-between z-20 fixed top-0 shadow  bg-gradient-to-r from-[#0052D4] via-[#4364F7] to-[#6FB1FC]`}
    >
      <p className={`text-[20px] font-bold text-[#ffd9cd]`}>Minter</p>
      <div className={`block`}>
        <w3m-button />
      </div>
    </nav>
  );
}

export default Navbar;
