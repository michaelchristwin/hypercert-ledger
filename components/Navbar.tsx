function Navbar() {
  return (
    <nav
      className={`flex w-full h-[90px] items-center fixed top-0 border-b-[0.5px] bg-black border-[#3e3d3d]`}
    >
      <div className={`translate-x-[90vw]`}>
        <w3m-button />
      </div>
    </nav>
  );
}

export default Navbar;
