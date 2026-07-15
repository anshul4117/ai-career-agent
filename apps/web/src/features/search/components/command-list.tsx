import React from "react";
import { SearchResult } from "../types/search";
import { CommandItem } from "./command-item";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchX } from "lucide-react";

interface CommandListProps {
  results: SearchResult[];
  selectedIndex: number;
  setSelectedIndex: (idx: number) => void;
  onSelect: (result: SearchResult) => void;
  title: string;
}

export function CommandList({ results, selectedIndex, setSelectedIndex, onSelect, title }: CommandListProps) {
  const isEmpty = results.length === 0;

  if (isEmpty) {
    return (
      <div className="py-14 px-6 flex justify-center">
        <div className="max-w-xs w-full">
          <EmptyState
            icon={SearchX}
            title="No results found"
            description="Try searching for something else or adjusting your spelling."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-[350px] overflow-y-auto overscroll-contain py-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
      <div className="mb-4 last:mb-0">
        <div className="px-4 py-1.5 text-[9px] font-black uppercase tracking-widest text-foreground-muted select-none">
          {title}
        </div>
        <div className="space-y-0.5">
          {results.map((result, currentIndex) => (
            <CommandItem
              key={`${result.id}-${currentIndex}`}
              result={result}
              isSelected={selectedIndex === currentIndex}
              onSelect={() => onSelect(result)}
              onMouseEnter={() => setSelectedIndex(currentIndex)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
