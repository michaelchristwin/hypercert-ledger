"use client";
import CreatableSelect from "react-select/creatable";
interface CreateSelectProps {
  placeholder: string;
}

function CreateSelect({ placeholder }: CreateSelectProps) {
  return (
    <CreatableSelect
      isMulti
      placeholder={placeholder}
      styles={{
        //@ts-ignore
        control: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: "#ffffff80;",
          ":focus": {
            outline: "hidden",
          },
        }),
      }}
    />
  );
}

export default CreateSelect;
