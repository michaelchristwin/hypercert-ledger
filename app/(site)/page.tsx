import Hero from "@/components/Hero";
import Rounds from "@/components/Rounds";

function Home() {
  return (
    <main
      className={`block h-fit w-full px-[30px] pt-[20px] relative lg:px-[40px] lg:pt-[20px]`}
    >
      <Hero />
      <Rounds />
    </main>
  );
}

export default Home;
