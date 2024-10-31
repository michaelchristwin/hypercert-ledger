import { ISOToUNIX, MyMetadata } from "@/actions/hypercerts";
import { fetchData } from "@/utils/indexer/graph";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const currentYear = new Date();
const cY = currentYear.getFullYear();

function useApplicationQuery(
  roundId: string,
  chainId: number,
  account: string
) {
  const [allow, setAllow] = useState(false);
  const [formDates, setFormDates] = useState({
    workTimeframeStart: `${cY}-01-01`,
    workTimeframeEnd: currentYear.toISOString().slice(0, 10),
    impactTimeframeStart: `${cY}-01-01`,
    impactTimeframeEnd: currentYear.toISOString().slice(0, 10),
  });

  const initialState: MyMetadata = {
    name: "",
    description: "",
    external_url: "",
    image: "",
    version: "1.0",
    properties: undefined,
    impactScope: ["All"],
    excludedImpactScope: [],
    workScope: [],
    excludedWorkScope: [],
    workTimeframeStart: ISOToUNIX(new Date(formDates.workTimeframeStart)),
    workTimeframeEnd: ISOToUNIX(new Date(formDates.workTimeframeEnd)),
    impactTimeframeStart: ISOToUNIX(new Date(formDates.impactTimeframeStart)),
    impactTimeframeEnd: ISOToUNIX(new Date(formDates.impactTimeframeEnd)),
    contributors: [],
    rights: ["Public Display"],
    excludedRights: [],
  };
  const [formValues, setFormValues] = useState<MyMetadata>(initialState);
  const [formImages, setFormImages] = useState({
    logoImage: "",
    bannerImage: "",
  });
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["applications"],
    queryFn: () => fetchData(roundId, chainId, account),
  });

  useEffect(() => {
    // @ts-ignore
    if (data && data.applications && data.applications.length > 0) {
      //@ts-ignore
      const application = data.applications[0];
      if (
        String(application.createdByAddress).toLowerCase() !==
        account.toLowerCase()
      ) {
        console.warn("Application does not belong to the current account");
        return;
      }
      const { metadata } = application.project;
      setFormValues((f) => ({
        ...f,
        name: metadata.title,
        description: metadata.description,
        external_url: metadata.website,
      }));
      setFormImages({
        logoImage: `https://ipfs.io/ipfs/${metadata.logoImg}`,
        bannerImage: `https://ipfs.io/ipfs/${metadata.bannerImg}`,
      });
      setAllow(true);
    }
  }, [data, account]);

  return {
    formValues,
    formImages,
    formDates,
    isLoading,
    isError,
    setFormValues,
    setFormImages,
    setFormDates,
    allow,
    error,
    // @ts-ignore
    applications: data?.applications || [],
  };
}

export default useApplicationQuery;
