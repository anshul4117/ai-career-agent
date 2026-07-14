"use client";

import React, { useState, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { BrutalButton } from "./brutal-button";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isDestructive = false,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: "10%" }}
                animate={{ opacity: 1, scale: 1, y: "0%" }}
                exit={{ opacity: 0, scale: 0.95, y: "10%" }}
                transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4 sm:p-0 focus:outline-none"
              >
                <div className="bg-surface border-4 border-border brutal-shadow-lg p-6 sm:p-8 space-y-6 flex flex-col items-center text-center relative overflow-hidden">
                  
                  {/* Close button */}
                  <Dialog.Close asChild>
                    <button
                      className="absolute right-3 top-3 p-1.5 hover:bg-surface-secondary border border-transparent hover:border-border rounded-sm transition-colors"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>

                  {/* Icon */}
                  <div className={`p-4 border-2 border-border brutal-shadow-sm rounded-none bg-surface-secondary ${isDestructive ? 'text-error border-error/50 bg-error/10' : 'text-foreground-muted'}`}>
                    <AlertTriangle className="h-8 w-8 stroke-[2.5px]" />
                  </div>

                  {/* Text Content */}
                  <div className="space-y-2 max-w-[280px]">
                    <Dialog.Title className="text-lg font-black uppercase text-foreground leading-tight tracking-tight">
                      {title}
                    </Dialog.Title>
                    <Dialog.Description className="text-xs font-semibold text-foreground-secondary leading-relaxed">
                      {description}
                    </Dialog.Description>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full pt-4">
                    <Dialog.Close asChild>
                      <BrutalButton variant="secondary" className="h-11 sm:h-10 px-6 uppercase text-[10px] font-black tracking-wider w-full sm:w-auto">
                        {cancelLabel}
                      </BrutalButton>
                    </Dialog.Close>
                    <BrutalButton
                      onClick={handleConfirm}
                      className={`h-11 sm:h-10 px-6 uppercase text-[10px] font-black tracking-wider w-full sm:w-auto ${
                        isDestructive ? "bg-error text-white hover:bg-error/90" : "bg-primary text-white"
                      }`}
                    >
                      {confirmLabel}
                    </BrutalButton>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}

// Hook for easier usage without needing to manage state in every component
export function useConfirm() {
  const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);
  const [config, setConfig] = useState<Omit<ConfirmDialogProps, 'isOpen' | 'onOpenChange' | 'onConfirm'> | null>(null);

  const confirm = useCallback((options: Omit<ConfirmDialogProps, 'isOpen' | 'onOpenChange' | 'onConfirm'>) => {
    return new Promise<boolean>((resolve) => {
      setConfig(options);
      setPromise({ resolve });
    });
  }, []);

  const handleClose = () => {
    setPromise(null);
    setConfig(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <ConfirmDialog
      isOpen={promise !== null}
      onOpenChange={(open) => {
        if (!open) handleCancel();
      }}
      title={config?.title || ""}
      description={config?.description || ""}
      confirmLabel={config?.confirmLabel}
      cancelLabel={config?.cancelLabel}
      isDestructive={config?.isDestructive}
      onConfirm={handleConfirm}
    />
  );

  return { confirm, ConfirmationDialog };
}
