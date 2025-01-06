function Footer() {
  return (
    <div
      className={`w-full absolute bottom-[0px] h-[40px] text-white bg-neutral-700 flex justify-center items-end`}
    >
      <p className={`font-bold`}>
        &copy;
        <a href="https://twitter.com/spark_eco">
          Spark {new Date().getFullYear()}
        </a>
      </p>
    </div>
  );
}

export default Footer;
