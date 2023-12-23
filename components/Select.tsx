"use client";
import Select from "react-select";
interface MultiSelectProps {
  options: any;
  placeholder: string;
  multi?: boolean;
  id: string;

  handleChange: (inputId: any) => void;
}
function DSelect({
  options,
  placeholder,
  multi,
  handleChange,
  id,
}: MultiSelectProps) {
  return (
    <Select
      inputId={id}
      name={id}
      options={options}
      isSearchable={false}
      onChange={handleChange}
      styles={{
        container: () => ({
          width: "100%",
          position: "relative",
        }),
        menuList: (styles, state) => ({
          width: "100%",
          position: "absolute",
          backgroundColor: "white",
          color: "black",
        }),
        multiValueRemove: () => ({
          color: "black",
        }),
        //@ts-ignore
        control: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: "black",
          ":focus": {
            outline: "hidden",
          },
        }),
        //@ts-ignore
        singleValue: (baseStyles, state) => ({
          ...baseStyles,
          color: "white",
        }),
      }}
      placeholder={placeholder}
      closeMenuOnSelect={!multi}
      isMulti={multi}
    />
  );
}

export default DSelect;
