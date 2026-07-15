"use client";

import React, { useEffect, useState, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchStore } from "../store/search.store";
import { useGlobalSearch } from "../hooks/use-global-search";
import { CommandInput } from "./command-input";
import { CommandList } from "./command-list";

export function CommandPalette() {
  const { isOpen, setIsOpen, toggleOpen } = useSearchStore();
  const { query, setQuery, results } = useGlobalSearch();
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global Shortcut Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleOpen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleOpen]);

  // Reset state when opened/closed
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen, setQuery]);

  // Handle local keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (results[selectedIndex]) {
          results[selectedIndex].onSelect();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
    },
    [results, selectedIndex, setIsOpen]
  );

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="fixed left-1/2 top-[15%] z-50 w-full max-w-xl -translate-x-1/2 focus:outline-none px-4 sm:px-0"
              >
                <div className="bg-surface border-[3px] border-border brutal-shadow-lg rounded-sm overflow-hidden flex flex-col">
                  <CommandInput 
                    query={query} 
                    setQuery={(q) => { setQuery(q); setSelectedIndex(0); }} 
                    onKeyDown={handleKeyDown} 
                  />
                  <CommandList
                    results={results}
                    title={query.trim().length === 0 ? "Recent Jobs" : "Jobs"}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                    onSelect={(result) => result.onSelect()}
                  />
                  
                  {/* Footer */}
                  <div className="border-t-2 border-border/10 bg-surface-secondary px-4 py-2 flex items-center justify-between text-[9px] font-black uppercase text-foreground-muted select-none">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1">
                        <kbd className="bg-surface border border-border/20 rounded-sm px-1 py-0.5">↑↓</kbd> to navigate
                      </span>
                      <span className="flex items-center gap-1">
                        <kbd className="bg-surface border border-border/20 rounded-sm px-1 py-0.5">↵</kbd> to select
                      </span>
                    </div>
                    <div>
                      <span className="flex items-center gap-1">
                        <kbd className="bg-surface border border-border/20 rounded-sm px-1 py-0.5">ESC</kbd> to close
                      </span>
                    </div>
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
