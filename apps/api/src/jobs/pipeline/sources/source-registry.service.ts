import { Injectable, Logger } from "@nestjs/common";
import { JobSourceAdapter } from "./job-source.interface";

@Injectable()
export class SourceRegistryService {
  private readonly logger = new Logger(SourceRegistryService.name);
  private readonly adapters = new Map<string, JobSourceAdapter>();

  register(adapter: JobSourceAdapter): void {
    const key = adapter.sourceName.toUpperCase();
    this.adapters.set(key, adapter);
    this.logger.log(
      `Registered Source Adapter: [${adapter.sourceName}] (Enabled: ${adapter.isEnabled})`,
    );
  }

  getAdapter(name: string): JobSourceAdapter | undefined {
    return this.adapters.get(name.toUpperCase());
  }

  getAllAdapters(): JobSourceAdapter[] {
    return Array.from(this.adapters.values());
  }

  getEnabledAdapters(selectedNames?: string[]): JobSourceAdapter[] {
    let list = Array.from(this.adapters.values()).filter((a) => a.isEnabled);
    if (selectedNames && selectedNames.length > 0) {
      const upper = selectedNames.map((s) => s.toUpperCase());
      list = list.filter((a) => upper.includes(a.sourceName.toUpperCase()));
    }
    return list;
  }
}
