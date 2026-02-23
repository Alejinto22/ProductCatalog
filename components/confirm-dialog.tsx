"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
  confirmLabel?: string
  destructive?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = "Confirmar",
  destructive = true,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-xl border border-border bg-card shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:max-w-[420px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-card-foreground">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-[13px] leading-relaxed">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="rounded-[10px] border-[#D1D5DB] text-[13px] btn-tracking transition-all duration-200 hover:bg-muted dark:border-input">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={`rounded-[10px] text-[13px] btn-tracking transition-all duration-200 hover:scale-[1.02] active:scale-100 ${
              destructive
                ? "bg-[#DC2626] text-white hover:bg-[#B91C1C]"
                : ""
            }`}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
