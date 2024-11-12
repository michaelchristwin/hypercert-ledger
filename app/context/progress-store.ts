import { create } from "zustand";

export type OperationStatus = "pending" | "loading" | "success" | "error";

export interface Operation {
  id: string;
  label: string;
  status: OperationStatus;
}

interface State {
  isOpen: boolean;
  operations: Operation[];
  currentStepId: string;
}

interface Actions {
  setIsOpen: (state: boolean) => void;
  setCurrentStep: (id: string) => void;
  updateOperationStatus: (id: string, status: OperationStatus) => void;
  resetOperations: () => void;
}

const initialOperations: Operation[] = [
  {
    id: "1",
    label: "Preparing to create allowlist",
    status: "pending",
  },
  {
    id: "2",
    label: "Creating allowlist on-chain",
    status: "pending",
  },
  {
    id: "3",
    label: "Waiting for on-chain confirmation",
    status: "pending",
  },
  {
    id: "4",
    label: "Minting your claim fraction",
    status: "pending",
  },
  {
    id: "5",
    label: "Waiting for onchain confirmation",
    status: "pending",
  },
];

const useProgressStore = create<State & Actions>((set) => ({
  isOpen: false,
  operations: initialOperations,
  currentStepId: "1",

  setIsOpen: (state) => set({ isOpen: state }),

  setCurrentStep: (id) => set({ currentStepId: id }),

  updateOperationStatus: (id, status) =>
    set((state) => ({
      operations: state.operations.map((op) =>
        op.id === id ? { ...op, status } : op
      ),
    })),

  resetOperations: () =>
    set({
      operations: initialOperations,
      currentStepId: "1",
      isOpen: false,
    }),
}));

export default useProgressStore;
