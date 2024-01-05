function Navbar() {
  return (
    <nav
      className={`flex w-[100vw] h-[90px] px-9 items-center justify-between z-20 fixed top-0 shadow bg-[#ffffff] backdrop-filter backdrop-blur-[20px] bg-opacity-10`}
    >
      <p className={`text-[23px] font-bold text-[#3a59ef]`}>MINTER</p>
      <div className={`block`}>
        <w3m-button />
      </div>
    </nav>
  );
}

export default Navbar;
