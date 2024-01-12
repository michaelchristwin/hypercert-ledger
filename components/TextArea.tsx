interface TextAreaProps {
  name: string;
  displayText: string;
  setDisplayText: React.Dispatch<React.SetStateAction<string>>;
  setStoredValues: React.Dispatch<React.SetStateAction<string[]>>;
}

function TextArea({
  name,
  displayText,
  setDisplayText,
  setStoredValues,
}: TextAreaProps) {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setDisplayText(value);
    const SplitedWords = displayText.split(",");
    const newSplitedWords = SplitedWords.map((word) => word.trim());
    setStoredValues(newSplitedWords);
  };
  return (
    <textarea
      name={name}
      value={displayText}
      id={name}
      className={`w-[100%] h-[150px] ps-2 bg-white/50 placeholder:text-black/60 rounded-[6px] focus:outline-none text-black`}
    ></textarea>
  );
}

export default TextArea;

export function convertArrayToDisplayText(wordArray: string[]) {
  return wordArray.join(", ");
}
