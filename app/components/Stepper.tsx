import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { CheckCircle2, XCircle, CircleDot, Loader } from "lucide-react";

export type Operation = {
  id: string;
  label: string;
  status: "pending" | "loading" | "success" | "error";
  message?: string;
};

interface OperationStepperProps {
  open: boolean;
  operations: Operation[];
  onOpenChange?: (open: boolean) => void;
}

const Stepper = ({ open, operations, onOpenChange }: OperationStepperProps) => {
  const isComplete = operations.every(
    (op) => op.status === "success" || op.status === "error"
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-6 py-4">
          <DialogTitle className="text-lg text-neutral-700">
            Processing
          </DialogTitle>
          <div className="space-y-4">
            {operations.map((operation) => (
              <div key={operation.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 pt-1">
                  {operation.status === "loading" && (
                    <Loader className="h-5 w-5 animate-spin text-purple-500" />
                  )}
                  {operation.status === "success" && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  {operation.status === "error" && (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  {operation.status === "pending" && (
                    <CircleDot className="h-5 w-5 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-gray-900">
                    {operation.label}
                  </p>
                  {operation.message && (
                    <p className="text-sm text-gray-500">{operation.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {isComplete && (
            <p className="text-sm text-center text-gray-500">
              All operations completed
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Stepper;
