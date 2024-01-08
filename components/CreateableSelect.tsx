"use client";
import CreatableSelect from "react-select/creatable";
interface CreateSelectProps {
  placeholder: string;
}

function CreateSelect({ placeholder }: CreateSelectProps) {
  return <CreatableSelect isMulti placeholder={placeholder} />;
}

export default CreateSelect;
