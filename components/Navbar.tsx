function Navbar() {
  return (
    <nav
      className={`flex w-[100vw] h-[90px] px-3 items-center justify-end z-20 fixed top-0 border-b-[0.5px] bg-black border-[#3e3d3d]`}
    >
      <div className={`block`}>
        <w3m-button />
      </div>
    </nav>
  );
}

export default Navbar;
