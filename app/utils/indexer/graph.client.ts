import { Client, cacheExchange, fetchExchange } from "urql";
import { graphql } from "gql.tada";

type Result<T, E = Error> = [E, null] | [null, T];

const GET_APPLICATIONS_QUERY = graphql(`
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
`);

export const urlClient = new Client({
  url: "https://grants-stack-indexer-v2.gitcoin.co/graphql",
  exchanges: [cacheExchange, fetchExchange],
});

export const getApplications = async ({
  id,
  chainId,
  creator,
}: {
  id: string;
  chainId: number;
  creator: string;
}): Promise<Result<any>> => {
  const { data, error } = await urlClient
    .query(GET_APPLICATIONS_QUERY, {
      id,
      chainId,
      creator,
    })
    .toPromise();
  if (error) {
    return [new Error(error.message), null];
  }
  return [null, data];
};
