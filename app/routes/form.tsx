import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@vercel/remix";
import FormComponent from "~/components/FormComponent";
import Stepper from "~/components/Stepper";
import useProgressStore from "~/context/progress-store";
import { getApplications } from "~/utils/indexer/graph.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const chainId = url.searchParams.get("chainId");
  const roundId = url.searchParams.get("roundId");
  const address = url.searchParams.get("address");
  if (!chainId || isNaN(Number(chainId))) {
    return Response.json(
      { error: "Invalid or missing chainId" },
      { status: 400 }
    );
  }
  if (!roundId) {
    return Response.json(
      { error: "Invalid or missing roundId" },
      { status: 400 }
    );
  }
  if (!address) {
    return Response.json(
      { error: "Invalid or missing address" },
      { status: 400 }
    );
  }
  const account =
    process.env.NODE_ENV === "development"
      ? "0xdc2a4bf46ef158f86274c02bd7f027f31da9ebc1"
      : address;

  const [error, data] = await getApplications({
    chainId: Number(chainId),
    id: roundId,
    creator: account,
  });
  if (error) {
    return Response.json({ error: "Error fetching data" }, { status: 400 });
  }

  return Response.json({ data });
};

function Form() {
  const dataRes = useLoaderData<typeof loader>();
  if ("error" in dataRes) {
    const { error } = dataRes;
    console.error(error);
  }
  const { data } = dataRes;
  const { isOpen, setIsOpen, operations } = useProgressStore();

  return (
    <div
      className={`w-full lg:pt-[130px] md:pt-[100px] pt-[70px] h-fit pb-[40px] flex justify-center`}
    >
      <FormComponent data={data} />
      <Stepper open={isOpen} onOpenChange={setIsOpen} operations={operations} />
    </div>
  );
}

export default Form;
