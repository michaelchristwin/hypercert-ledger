import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@vercel/remix";
import FormComponent from "~/components/FormComponent";
import { fetchData } from "~/utils/indexer/graph.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const chainId = url.searchParams.get("chainId");
  const roundId = url.searchParams.get("roundId");
  const address = url.searchParams.get("address");
  if (!chainId || isNaN(Number(chainId))) {
    return json({ error: "Invalid or missing chainId" }, { status: 400 });
  }
  if (!roundId) {
    return json({ error: "Invalid or missing roundId" }, { status: 400 });
  }
  if (!address) {
    return json({ error: "Invalid or missing address" }, { status: 400 });
  }
  const account =
    process.env.NODE_ENV === "development"
      ? "0xdc2a4bf46ef158f86274c02bd7f027f31da9ebc1"
      : address;

  const data = await fetchData({
    chainId: Number(chainId),
    id: roundId,
    creator: account,
  });

  return json({ data });
};

function Form() {
  const dataRes = useLoaderData<typeof loader>();
  if ("error" in dataRes) {
    const { error } = dataRes;
    console.error(error);
  }
  //@ts-expect-error"ddd"
  const { data } = dataRes;
  return (
    <div className={`w-full pt-[130px] h-fit py-[40px] flex justify-center`}>
      <FormComponent data={data} />
    </div>
  );
}

export default Form;
