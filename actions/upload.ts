import { NFTStorage } from "nft.storage";

const NFTSTORAGE = process.env.NEXT_PUBLIC_NFTSTORAGE as string;

export const decodeImage = (base64String: string) => {
  let imageBlob;
  try {
    const dataPart = base64String.split(",")[1];
    const decodedData = atob(dataPart);
    const dataArray = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
      dataArray[i] = decodedData.charCodeAt(i);
    }
    imageBlob = new Blob([dataArray], { type: "application/octet-stream" });
  } catch (err) {
    console.error("Decode failed:", err);
  }
  return imageBlob;
};

export const uploadImage = async (image: Blob) => {
  let hash;
  const nftstorage = new NFTStorage({ token: NFTSTORAGE });
  try {
    hash = await nftstorage.storeBlob(image);
  } catch (err) {
    console.error("File upload failed:", err);
  }
  return hash;
};
