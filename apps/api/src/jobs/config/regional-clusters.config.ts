import {
  INDIAN_CITIES_GAZETTEER,
  REGIONAL_CLUSTERS,
} from "../pipeline/config/indian-cities-gazetteer.config";

export interface WidenedLocationMeta {
  applied: boolean;
  reason?: string;
  cities?: string[];
}

export type JobMatchType = "EXACT" | "NEARBY" | "REMOTE_INDIA" | "PAN_INDIA";

export interface ClusterLookupResult {
  canonicalCity: string;
  clusterName?: string;
  nearbyCities: string[];
  aliases: string[];
}

/**
 * Looks up cluster information and aliases for any Indian city string.
 */
export function getCityClusterInfo(cityQuery: string): ClusterLookupResult {
  const norm = cityQuery.trim().toLowerCase();

  for (const entry of INDIAN_CITIES_GAZETTEER) {
    if (
      entry.city.toLowerCase() === norm ||
      entry.aliases.some((a) => a.toLowerCase() === norm)
    ) {
      const clusterCities =
        entry.cluster && REGIONAL_CLUSTERS[entry.cluster]
          ? REGIONAL_CLUSTERS[entry.cluster].filter(
              (c) => c.toLowerCase() !== entry.city.toLowerCase(),
            )
          : [];

      return {
        canonicalCity: entry.city,
        clusterName: entry.cluster,
        nearbyCities: clusterCities,
        aliases: entry.aliases,
      };
    }
  }

  // Fallback for cities not yet in gazetteer
  return {
    canonicalCity: cityQuery.trim(),
    nearbyCities: [],
    aliases: [norm],
  };
}

export { INDIAN_CITIES_GAZETTEER, REGIONAL_CLUSTERS };
