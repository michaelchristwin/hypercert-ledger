import { LoaderCircle } from "lucide-react";
import { memo, useEffect, useState } from "react";

const Validity = memo(({ url }: { url: string }) => {
  const [isValid, setIsValid] = useState<boolean>();
  useEffect(() => {
    if (url) {
      (async () => {
        try {
          let valid = await checkImage(url);
          setIsValid(valid);
        } catch (err) {
          setIsValid(false);
          console.log(err);
        }
      })();
    } else {
      setIsValid(undefined);
    }
  }, [url]);
  if (url && isValid === undefined) {
    return (
      <LoaderCircle className={`absolute animate-spin top-[28%] right-2`} />
    );
  } else if (url && isValid) {
    return (
      <svg
        className={`absolute top-[28%] right-1`}
        fill="#43eb62"
        width={16}
        height={16}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0z"
          fill="#ffffff"
        />
        <path
          fill="#43eb62"
          d="M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"
        />
      </svg>
    );
  } else if (url && !isValid) {
    return (
      <svg
        className={`absolute top-[28%] right-2`}
        width={16}
        height={16}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path
          d="M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"
          fill="#FF0000" // Red fill color for the outer shape
        />
        <path
          d="M11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"
          fill="#FFFFFF" // White fill color for the line
        />
      </svg>
    );
  } else {
    return null; // Assuming you want to return nothing when url is present but isValid is false or undefined, and when url is not present
  }
});

Validity.displayName = "Validity";
export default Validity;

const checkImage = (url: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => reject(false);
    img.src = url;
  });
};
