import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export interface ConfirmDialogState {
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
}

interface ConfirmDialogProps {
  state: ConfirmDialogState | null;
  onClose: () => void;
}

/**
 * A single reusable replacement for window.confirm() — used wherever a page
 * needs to confirm one destructive or semi-destructive action at a time.
 * Render once per page, drive it with a `ConfirmDialogState | null` in state.
 */
export function ConfirmDialog({ state, onClose }: ConfirmDialogProps) {
  return (
    <AlertDialog open={state !== null} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{state?.title}</AlertDialogTitle>
          <AlertDialogDescription>{state?.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={cn(state?.destructive && "bg-destructive text-destructive-foreground hover:bg-destructive/90")}
            onClick={async () => {
              await state?.onConfirm();
              onClose();
            }}
          >
            {state?.confirmLabel ?? "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
