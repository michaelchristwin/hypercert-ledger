import { gql, request } from "graphql-request";
//import toast from "react-hot-toast";

export const fetchData = async (
  id: string,
  chainId: number,
  creator: string
) => {
  //const tId = toast.loading("hypercert is being pre-filled.....");
  try {
    const data = await request(
      "https://grants-stack-indexer-v2.gitcoin.co/graphql",
      GET_APPLICATIONS_QUERY,
      { id, chainId, creator }
    );
    //toast.success("Pre-fill Successful", { id: tId });
    console.log(data);
    return data;
  } catch (err) {
    //toast.error("You don't have a grant application", { id: tId });
    throw err;
  }
};
const GET_APPLICATIONS_QUERY = gql`
  query GetApplications($id: String!, $chainId: Int!, $creator: String!) {
    applications(
      condition: { roundId: $id, chainId: $chainId, createdByAddress: $creator }
    ) {
      createdByAddress
      uniqueDonorsCount
      totalAmountDonatedInUsd
      project {
        metadata
      }
      donations {
        donorAddress
        amountInUsd
      }
    }
  }
`;
