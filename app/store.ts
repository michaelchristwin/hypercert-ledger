import { create } from "zustand";

interface State {
  year: string;
  setYear: (arg: string) => void;
  props: string;
  setProps: (arg: string) => void;
}

const useStore = create<State>((set) => ({
  year: "",
  setYear: (newYear: string) => set({ year: newYear }),
  props: "",
  setProps(arg) {
    set({ props: arg });
  },
}));

export default useStore;
