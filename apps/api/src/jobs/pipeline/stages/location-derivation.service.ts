import { Injectable } from "@nestjs/common";
import { LocationConfidence, LocationSource } from "@prisma/client";
import {
  GazetteerCity,
  INDIAN_CITIES_GAZETTEER,
} from "../config/indian-cities-gazetteer.config";

export interface LocationDerivationInput {
  rawLocation?: string | null;
  title?: string | null;
  description?: string | null;
  queriedCity?: string | null;
}

export interface LocationDerivationResult {
  rawLocation: string;
  city: string | null;
  state: string | null;
  queriedCity: string | null;
  locationSource: LocationSource;
  locationConfidence: LocationConfidence;
}

@Injectable()
export class LocationDerivationService {
  /**
   * Derives city, state, location source, and confidence using the Indian cities gazetteer.
   * Strictly adheres to location integrity:
   * 1. A queried city is a QUERY_HINT with LOW confidence; it is NEVER used to fabricate a city.
   * 2. City-level supply is only populated when supported by SOURCE (HIGH) or PARSED_TEXT (MEDIUM).
   */
  deriveLocation(input: LocationDerivationInput): LocationDerivationResult {
    const rawLoc = (input.rawLocation || "").trim();
    const title = (input.title || "").trim();
    const desc = (input.description || "").trim();
    const queriedCity = (input.queriedCity || "").trim() || null;

    // Default fallback
    const result: LocationDerivationResult = {
      rawLocation: rawLoc || "India",
      city: null,
      state: null,
      queriedCity,
      locationSource: LocationSource.UNKNOWN,
      locationConfidence: LocationConfidence.LOW,
    };

    // 1. Check rawLocation if it provides a specific city (not generic "India" or "Remote")
    if (rawLoc) {
      const isGeneric =
        rawLoc.toLowerCase() === "india" ||
        rawLoc.toLowerCase() === "remote" ||
        rawLoc.toLowerCase() === "anywhere";

      if (!isGeneric) {
        const match = this.matchCityInText(rawLoc);
        if (match) {
          result.city = match.city;
          result.state = match.state;
          result.locationSource = LocationSource.SOURCE;
          result.locationConfidence = LocationConfidence.HIGH;
          return result;
        }
      }
    }

    // 2. Try parsing city from job title
    if (title) {
      const match = this.matchCityInText(title);
      if (match) {
        result.city = match.city;
        result.state = match.state;
        result.locationSource = LocationSource.PARSED_TEXT;
        result.locationConfidence = LocationConfidence.MEDIUM;
        return result;
      }
    }

    // 3. Try parsing city from job description location context
    if (desc) {
      // Look for explicit location clues e.g. "Location: Noida", "Work Location: Lucknow", "Office: Gurgaon"
      const locationClues = [
        /(?:location|job location|work location|base location|office|posted in|hiring in|based in)[\s:\-–—]+([a-zA-Z\s,]+)/i,
        /\b(?:in|at)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)?),\s*(?:India|UP|Uttar Pradesh|Haryana|Maharashtra|Karnataka|Delhi)/,
      ];

      for (const pattern of locationClues) {
        const snippetMatch = desc.match(pattern);
        if (snippetMatch && snippetMatch[1]) {
          const cityMatch = this.matchCityInText(snippetMatch[1]);
          if (cityMatch) {
            result.city = cityMatch.city;
            result.state = cityMatch.state;
            result.locationSource = LocationSource.PARSED_TEXT;
            result.locationConfidence = LocationConfidence.MEDIUM;
            return result;
          }
        }
      }

      // Secondary check: word-boundary match of any city across description
      const generalDescMatch = this.matchCityInText(desc);
      if (generalDescMatch) {
        result.city = generalDescMatch.city;
        result.state = generalDescMatch.state;
        result.locationSource = LocationSource.PARSED_TEXT;
        result.locationConfidence = LocationConfidence.MEDIUM;
        return result;
      }
    }

    // 4. If no exact city was evidenced, but a queriedCity was supplied
    if (queriedCity && queriedCity.toLowerCase() !== "india") {
      result.city = null; // Do NOT fabricate!
      result.state = null;
      result.locationSource = LocationSource.QUERY_HINT;
      result.locationConfidence = LocationConfidence.LOW;
      return result;
    }

    // 5. Default/Generic
    result.locationSource = LocationSource.SOURCE;
    result.locationConfidence = LocationConfidence.LOW;
    return result;
  }

  /**
   * Matches a city from the gazetteer within arbitrary text using word boundaries.
   */
  private matchCityInText(text: string): GazetteerCity | null {
    const normalized = text.toLowerCase();
    for (const entry of INDIAN_CITIES_GAZETTEER) {
      for (const alias of entry.aliases) {
        const regex = new RegExp(
          `\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
          "i",
        );
        if (regex.test(normalized)) {
          return entry;
        }
      }
    }
    return null;
  }
}
