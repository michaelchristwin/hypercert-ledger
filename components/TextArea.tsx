import { MyMetadata } from "@/actions/hypercerts";

interface TextAreaProps {
  name: string;
  displayText: string;
  setDisplayText: React.Dispatch<React.SetStateAction<string>>;
  setStoredValues: React.Dispatch<React.SetStateAction<string[]>>;
  formValues: MyMetadata;
  setFormValues: React.Dispatch<React.SetStateAction<MyMetadata>>;
}

function TextArea({
  name,
  displayText,
  setDisplayText,
  setStoredValues,
  formValues,
  setFormValues,
}: TextAreaProps) {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value, name } = event.target;
    setDisplayText(value);
    const SplitedWords = value.split(",");
    const newSplitedWords = SplitedWords.map((word) => word.trim());
    setStoredValues(newSplitedWords);
    setFormValues({
      ...formValues,
      [name]: newSplitedWords,
    });
  };
  return (
    <textarea
      name={name}
      value={displayText}
      id={name}
      onChange={handleChange}
      className={`w-[100%] h-[150px] ps-2 bg-white/50 placeholder:text-black/60 rounded-[6px] focus:outline-none text-black`}
    ></textarea>
  );
}

export default TextArea;

export function convertArrayToDisplayText(wordArray: any[]) {
  return wordArray.join(", ");
}
