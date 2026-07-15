import { Search } from "lucide-react";

interface CommandInputProps {
  query: string;
  setQuery: (q: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function CommandInput({ query, setQuery, onKeyDown }: CommandInputProps) {
  return (
    <div className="flex items-center px-4 py-3 border-b-2 border-border bg-surface">
      <Search className="h-5 w-5 text-foreground-muted mr-3 stroke-[2.5px]" />
      <input
        className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-foreground placeholder:text-foreground-muted"
        placeholder="Search jobs..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        autoFocus
      />
      <div className="flex items-center gap-1">
        <kbd className="text-[9px] font-black uppercase text-foreground-muted bg-surface-secondary border border-border/20 rounded-sm px-1.5 py-0.5 select-none">ESC</kbd>
      </div>
    </div>
  );
}
