import {
  createContext,
  useContext,
  useState,
  SetStateAction,
  Dispatch,
  useEffect,
} from "react";
import { Chain } from "viem";
type AppContextProps = {
  children: React.ReactNode;
};

type State = {
  isWrongNetwork: boolean;
  setIsWrongNetwork: Dispatch<SetStateAction<boolean>>;
  correctNetwork: Chain | undefined;
  setCorrectNetwork: Dispatch<SetStateAction<Chain | undefined>>;
};

const Context = createContext<State | undefined>(undefined);

export const AppContext = ({ children }: AppContextProps) => {
  const [isWrongNetwork, setIsWrongNetwork] = useState<boolean>(false);
  const [correctNetwork, setCorrectNetwork] = useState<Chain | undefined>(
    undefined
  );
  const state: State = {
    isWrongNetwork,
    setIsWrongNetwork,
    correctNetwork,
    setCorrectNetwork,
  };
  return <Context.Provider value={state}>{children}</Context.Provider>;
};

export const useAppContext = (): State => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useContext must be used within a StateContext Provider");
  }
  return context;
};
