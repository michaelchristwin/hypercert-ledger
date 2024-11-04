import { gql, request } from "graphql-request";

export const fetchData = async ({
  id,
  chainId,
  creator,
}: {
  id: string;
  chainId: number;
  creator: string;
}) => {
  try {
    const data = await request(
      "https://grants-stack-indexer-v2.gitcoin.co/graphql",
      GET_APPLICATIONS_QUERY,
      { id, chainId, creator }
    );
    //console.log("Server data:", data);
    return data;
  } catch (err) {
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
