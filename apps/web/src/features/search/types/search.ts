import { LucideIcon } from "lucide-react";

export interface SearchResult {
  id: string;
  title: string;
  company: string;
  location: string;
  icon: LucideIcon;
  onSelect: () => void;
}
