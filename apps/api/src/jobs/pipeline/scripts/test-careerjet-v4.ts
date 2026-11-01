import * as dotenv from "dotenv";
dotenv.config();

import { LocationDerivationService } from "../stages/location-derivation.service";

interface CareerjetV4RawResponse {
  type?: string;
  error?: string;
  message?: string;
  locations?: string[];
  jobs?: {
    locations?: string;
    title?: string;
    description?: string;
    url?: string;
  }[];
  hits?: number;
}

async function testCity(
  apiKey: string,
  city: string,
  keyword: string = "software engineer",
) {
  const url = new URL("https://search.api.careerjet.net/v4/query");
  url.searchParams.set("locale_code", "en_IN");
  url.searchParams.set("keywords", keyword);
  url.searchParams.set("location", city);
  url.searchParams.set("page", "1");
  url.searchParams.set("page_size", "20");
  url.searchParams.set("user_ip", "103.21.124.1");
  url.searchParams.set("user_agent", "AICareerAgent-JobPipeline/1.0");

  const authHeader = `Basic ${Buffer.from(apiKey + ":").toString("base64")}`;

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: authHeader,
        Accept: "application/json",
      },
    });

    const status = res.status;
    const bodyText = await res.text();
    let json: CareerjetV4RawResponse | null = null;
    try {
      json = JSON.parse(bodyText) as CareerjetV4RawResponse;
    } catch {
      // not JSON
    }

    if (!res.ok) {
      return {
        city,
        status,
        success: false,
        type: json?.type || "HTTP_ERROR",
        total: 0,
        returned: 0,
        parseableCityCount: 0,
        parseablePercent: "0%",
        sampleLocation: "N/A",
        rawError: String(
          json?.error || json?.message || bodyText || res.statusText,
        ).slice(0, 150),
      };
    }

    const type = json?.type;
    if (type === "LOCATIONS") {
      return {
        city,
        status,
        success: true,
        type: "LOCATIONS",
        total: json?.locations?.length || 0,
        returned: json?.locations?.length || 0,
        parseableCityCount: 0,
        parseablePercent: "0% (Ambiguous location prompt)",
        sampleLocation: json?.locations?.[0] || "N/A",
        rawError: "None (Ambiguous Location)",
      };
    }

    if (type === "JOBS" && Array.isArray(json?.jobs)) {
      const derivation = new LocationDerivationService();
      let parseable = 0;
      let sampleLoc = "N/A";
      for (const j of json.jobs) {
        if (!sampleLoc && j.locations) sampleLoc = j.locations;
        const derived = derivation.deriveLocation({
          rawLocation: j.locations,
          title: j.title,
          description: j.description,
        });
        if (derived.city) parseable++;
      }

      return {
        city,
        status,
        success: true,
        type: "JOBS",
        total: json.hits || 0,
        returned: json.jobs.length,
        parseableCityCount: parseable,
        parseablePercent: `${Math.round((parseable / (json.jobs.length || 1)) * 100)}%`,
        sampleLocation: sampleLoc || "None provided",
        rawError: "None",
      };
    }

    return {
      city,
      status,
      success: false,
      type: type || "UNKNOWN_TYPE",
      total: 0,
      returned: 0,
      parseableCityCount: 0,
      parseablePercent: "0%",
      sampleLocation: "N/A",
      rawError: bodyText.slice(0, 150),
    };
  } catch (err: unknown) {
    return {
      city,
      status: "NETWORK_ERROR",
      success: false,
      type: "EXCEPTION",
      total: 0,
      returned: 0,
      parseableCityCount: 0,
      parseablePercent: "0%",
      sampleLocation: "N/A",
      rawError: (err as Error).message.slice(0, 150),
    };
  }
}

async function main() {
  const apiKey = process.env.CAREERJET_API_KEY;
  console.log("=== TESTING CAREERJET v4 API ACROSS TARGET CITIES ===");
  console.log(
    `CAREERJET_API_KEY configured: ${Boolean(apiKey)} (Length: ${apiKey?.length || 0})`,
  );

  if (!apiKey) {
    console.error("CAREERJET_API_KEY is missing from environment.");
    process.exit(1);
  }

  const cities = [
    "Noida",
    "Lucknow",
    "Meerut",
    "Kanpur",
    "Indore",
    "Jaipur",
    "Bhopal",
    "Nagpur",
    "Chandigarh",
  ];

  const results: Awaited<ReturnType<typeof testCity>>[] = [];
  for (const c of cities) {
    console.log(`Querying Careerjet v4 for: "${c}"...`);
    const r = await testCity(apiKey, c);
    results.push(r);
  }

  console.log("\n=== CAREERJET v4 TARGET CITIES AUDIT REPORT ===");
  console.table(
    results.map((r) => ({
      City: r.city,
      Status: r.status,
      Type: r.type,
      "Total Hits": r.total,
      Returned: r.returned,
      "Parseable City %": r.parseablePercent,
      "Sample Location": r.sampleLocation.slice(0, 25),
      "Response Body / Error": r.rawError.slice(0, 40),
    })),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
