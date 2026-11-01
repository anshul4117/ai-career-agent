import { Injectable, Logger } from "@nestjs/common";
import {
  CITIES_CONFIG,
  EXPERIENCE_BANDS,
  ROLE_CATEGORIES,
} from "./query-matrix.config";
import { SourceRegistryService } from "../sources/source-registry.service";
import * as crypto from "crypto";

export interface QuerySlice {
  id: string;
  category: string;
  isTech: boolean;
  keyword: string;
  city: string;
  state: string;
  tier: "TIER_1" | "TIER_2" | "TIER_3";
  experienceBand: "FRESHER" | "JUNIOR_0_2" | "MID_2_5";
  workMode: "ONSITE" | "REMOTE";
  queryTerm: string;
}

export interface SliceYieldRecord {
  sliceId: string;
  category: string;
  isTech: boolean;
  keyword: string;
  city: string;
  tier: "TIER_1" | "TIER_2" | "TIER_3";
  experienceBand: string;
  workMode: string;
  timesQueried: number;
  totalFetched: number;
  indiaEligible: number;
  newJobsInserted: number;
  tier2Or3Jobs: number;
  lastQueriedAt: Date;
}

export interface SourceStatusItem {
  sourceName: string;
  status: "ACTIVE" | "UNAVAILABLE";
  reason: string;
  contributing: boolean;
}

@Injectable()
export class QueryMatrixService {
  private readonly logger = new Logger(QueryMatrixService.name);

  private readonly slices: QuerySlice[] = [];
  private currentSliceIndex = 0;
  private readonly yieldStats = new Map<string, SliceYieldRecord>();

  constructor(private readonly sourceRegistry: SourceRegistryService) {
    this.slices = this.buildMatrixSlices();
    this.logger.log(
      `Initialized Query Matrix with ${this.slices.length} slices.`,
    );
  }

  private buildMatrixSlices(): QuerySlice[] {
    const categorySlices: Map<string, QuerySlice[]> = new Map();

    for (const roleCat of ROLE_CATEGORIES) {
      const catList: QuerySlice[] = [];
      for (const kw of roleCat.searchKeywords) {
        for (const exp of EXPERIENCE_BANDS) {
          // 1. Onsite queries per city
          for (const city of CITIES_CONFIG) {
            const expSynonym = exp.synonyms[0] || "fresher";
            const queryTerm = `${kw} ${expSynonym}`.trim();
            const sliceKey = `${kw}_${city.city}_${exp.band}_ONSITE`;
            const id = crypto
              .createHash("md5")
              .update(sliceKey)
              .digest("hex")
              .slice(0, 12);

            catList.push({
              id,
              category: roleCat.category,
              isTech: roleCat.isTech,
              keyword: kw,
              city: city.city,
              state: city.state,
              tier: city.tier,
              experienceBand: exp.band,
              workMode: "ONSITE",
              queryTerm,
            });
          }

          // 2. Pan-India Remote queries
          const expSynonym = exp.synonyms[0] || "fresher";
          const queryTerm = `${kw} remote ${expSynonym}`.trim();
          const sliceKey = `${kw}_India_Remote_${exp.band}`;
          const id = crypto
            .createHash("md5")
            .update(sliceKey)
            .digest("hex")
            .slice(0, 12);

          catList.push({
            id,
            category: roleCat.category,
            isTech: roleCat.isTech,
            keyword: kw,
            city: "India",
            state: "Pan-India",
            tier: "TIER_1",
            experienceBand: exp.band,
            workMode: "REMOTE",
            queryTerm,
          });
        }
      }
      categorySlices.set(roleCat.category, catList);
    }

    // Interleave slices across categories so every batch of slices is diverse
    const interleaved: QuerySlice[] = [];
    const maxLen = Math.max(
      ...Array.from(categorySlices.values()).map((l) => l.length),
    );

    for (let i = 0; i < maxLen; i++) {
      for (const catList of categorySlices.values()) {
        if (i < catList.length) {
          interleaved.push(catList[i]);
        }
      }
    }

    return interleaved;
  }

  getTotalSliceCount(): number {
    return this.slices.length;
  }

  /**
   * Retrieves the next rotating batch of slices for a pipeline run.
   */
  getNextBatch(batchSize = 10, filterTier2_3Only = false): QuerySlice[] {
    let pool = this.slices;
    if (filterTier2_3Only) {
      pool = this.slices.filter(
        (s) => s.tier === "TIER_2" || s.tier === "TIER_3",
      );
    }

    if (pool.length === 0) return [];

    const batch: QuerySlice[] = [];
    for (let i = 0; i < batchSize; i++) {
      const idx = (this.currentSliceIndex + i) % pool.length;
      batch.push(pool[idx]);
    }

    this.currentSliceIndex = (this.currentSliceIndex + batchSize) % pool.length;
    return batch;
  }

  /**
   * Records execution yield metrics for a slice.
   */
  recordYield(
    slice: QuerySlice,
    results: {
      fetched: number;
      indiaEligible: number;
      newJobs: number;
      tier2Or3Jobs: number;
    },
  ): void {
    const existing = this.yieldStats.get(slice.id);
    if (!existing) {
      this.yieldStats.set(slice.id, {
        sliceId: slice.id,
        category: slice.category,
        isTech: slice.isTech,
        keyword: slice.keyword,
        city: slice.city,
        tier: slice.tier,
        experienceBand: slice.experienceBand,
        workMode: slice.workMode,
        timesQueried: 1,
        totalFetched: results.fetched,
        indiaEligible: results.indiaEligible,
        newJobsInserted: results.newJobs,
        tier2Or3Jobs: results.tier2Or3Jobs,
        lastQueriedAt: new Date(),
      });
    } else {
      existing.timesQueried += 1;
      existing.totalFetched += results.fetched;
      existing.indiaEligible += results.indiaEligible;
      existing.newJobsInserted += results.newJobs;
      existing.tier2Or3Jobs += results.tier2Or3Jobs;
      existing.lastQueriedAt = new Date();
    }
  }

  /**
   * Returns a comprehensive yield report across all queried slices.
   */
  getYieldSummary(): {
    totalSlicesInMatrix: number;
    slicesExecuted: number;
    totalFetched: number;
    totalNewJobs: number;
    tier2Or3JobsCollected: number;
    topSlices: SliceYieldRecord[];
    zeroYieldSlicesCount: number;
  } {
    const records = Array.from(this.yieldStats.values());
    const totalFetched = records.reduce((sum, r) => sum + r.totalFetched, 0);
    const totalNewJobs = records.reduce((sum, r) => sum + r.newJobsInserted, 0);
    const tier2Or3JobsCollected = records.reduce(
      (sum, r) => sum + r.tier2Or3Jobs,
      0,
    );

    const sortedByYield = [...records].sort(
      (a, b) => b.newJobsInserted - a.newJobsInserted,
    );

    const zeroYieldSlicesCount = records.filter(
      (r) => r.newJobsInserted === 0,
    ).length;

    return {
      totalSlicesInMatrix: this.slices.length,
      slicesExecuted: records.length,
      totalFetched,
      totalNewJobs,
      tier2Or3JobsCollected,
      topSlices: sortedByYield.slice(0, 15),
      zeroYieldSlicesCount,
    };
  }

  /**
   * Transparent source contribution and availability report.
   * Reports disabled sources honestly instead of hiding them.
   */
  getSourceStatusReport(): SourceStatusItem[] {
    const knownSources = [
      { name: "JOOBLE", keyEnv: "JOOBLE_API_KEY", cardRequired: false },
      { name: "CAREERJET", keyEnv: "CAREERJET_API_KEY", cardRequired: false },
      { name: "ADZUNA", keyEnv: "ADZUNA_APP_ID", cardRequired: true },
      { name: "JSEARCH", keyEnv: "RAPIDAPI_KEY", cardRequired: true },
      { name: "GREENHOUSE", keyEnv: null, cardRequired: false },
      { name: "LEVER", keyEnv: null, cardRequired: false },
      { name: "ASHBY", keyEnv: null, cardRequired: false },
      { name: "SMARTRECRUITERS", keyEnv: null, cardRequired: false },
      { name: "WORKABLE", keyEnv: null, cardRequired: false },
      { name: "REMOTIVE", keyEnv: null, cardRequired: false },
      { name: "REMOTEOK", keyEnv: null, cardRequired: false },
    ];

    const report: SourceStatusItem[] = [];

    for (const src of knownSources) {
      const adapter = this.sourceRegistry.getAdapter(src.name);

      if (src.cardRequired) {
        report.push({
          sourceName: src.name,
          status: "UNAVAILABLE",
          reason: "unavailable: needs card",
          contributing: false,
        });
        continue;
      }

      if (adapter && adapter.isEnabled) {
        report.push({
          sourceName: src.name,
          status: "ACTIVE",
          reason: "configured with active public/free API access",
          contributing: true,
        });
      } else {
        report.push({
          sourceName: src.name,
          status: "UNAVAILABLE",
          reason: src.keyEnv
            ? `missing ${src.keyEnv}`
            : "disabled by configuration",
          contributing: false,
        });
      }
    }

    return report;
  }
}
