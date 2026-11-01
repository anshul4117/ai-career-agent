export interface GazetteerCity {
  city: string;
  state: string;
  tier: "TIER_1" | "TIER_2" | "TIER_3";
  cluster?: string;
  aliases: string[];
}

export const INDIAN_CITIES_GAZETTEER: GazetteerCity[] = [
  // --- National Capital Region (NCR) ---
  {
    city: "Noida",
    state: "Uttar Pradesh",
    tier: "TIER_1",
    cluster: "NCR",
    aliases: ["noida", "greater noida", "noida extension"],
  },
  {
    city: "Delhi",
    state: "Delhi",
    tier: "TIER_1",
    cluster: "NCR",
    aliases: [
      "delhi",
      "new delhi",
      "newdelhi",
      "central delhi",
      "south delhi",
      "west delhi",
      "north delhi",
    ],
  },
  {
    city: "Gurgaon",
    state: "Haryana",
    tier: "TIER_1",
    cluster: "NCR",
    aliases: ["gurgaon", "gurugram", "manesar", "sohna"],
  },
  {
    city: "Faridabad",
    state: "Haryana",
    tier: "TIER_2",
    cluster: "NCR",
    aliases: ["faridabad", "ballabhgarh"],
  },
  {
    city: "Ghaziabad",
    state: "Uttar Pradesh",
    tier: "TIER_2",
    cluster: "NCR",
    aliases: ["ghaziabad", "sahibabad", "indirapuram", "vaishali"],
  },

  // --- Mumbai Metropolitan Region (MMR) ---
  {
    city: "Mumbai",
    state: "Maharashtra",
    tier: "TIER_1",
    cluster: "MUMBAI_MMR",
    aliases: [
      "mumbai",
      "bombay",
      "south mumbai",
      "andheri",
      "bandra",
      "powai",
      "kurla",
      "worli",
    ],
  },
  {
    city: "Navi Mumbai",
    state: "Maharashtra",
    tier: "TIER_2",
    cluster: "MUMBAI_MMR",
    aliases: [
      "navi mumbai",
      "vashi",
      "belapur",
      "nerul",
      "kharghar",
      "airoli",
      "panvel",
    ],
  },
  {
    city: "Thane",
    state: "Maharashtra",
    tier: "TIER_2",
    cluster: "MUMBAI_MMR",
    aliases: ["thane", "kalyan", "dombivli", "bhiwandi", "mira bhayandar"],
  },

  // --- Metros & Major Tech Hubs ---
  {
    city: "Bengaluru",
    state: "Karnataka",
    tier: "TIER_1",
    cluster: "BENGALURU",
    aliases: [
      "bengaluru",
      "bangalore",
      "whitefield",
      "electronic city",
      "koramangala",
      "indiranagar",
    ],
  },
  {
    city: "Pune",
    state: "Maharashtra",
    tier: "TIER_1",
    cluster: "PUNE",
    aliases: [
      "pune",
      "poona",
      "hinjewadi",
      "magarpatta",
      "vimannagar",
      "pimpri-chinchwad",
    ],
  },
  {
    city: "Hyderabad",
    state: "Telangana",
    tier: "TIER_1",
    cluster: "HYDERABAD",
    aliases: [
      "hyderabad",
      "secunderabad",
      "cyberabad",
      "gachibowli",
      "hitec city",
      "madhapur",
    ],
  },
  {
    city: "Chennai",
    state: "Tamil Nadu",
    tier: "TIER_1",
    cluster: "CHENNAI",
    aliases: ["chennai", "madras", "omr", "guindy", "tambaram"],
  },
  {
    city: "Kolkata",
    state: "West Bengal",
    tier: "TIER_1",
    cluster: "KOLKATA",
    aliases: ["kolkata", "calcutta", "salt lake", "new town"],
  },

  // --- Chandigarh Tri-City ---
  {
    city: "Chandigarh",
    state: "Chandigarh",
    tier: "TIER_2",
    cluster: "TRI_CITY",
    aliases: ["chandigarh"],
  },
  {
    city: "Mohali",
    state: "Punjab",
    tier: "TIER_2",
    cluster: "TRI_CITY",
    aliases: ["mohali", "sas nagar"],
  },
  {
    city: "Panchkula",
    state: "Haryana",
    tier: "TIER_2",
    cluster: "TRI_CITY",
    aliases: ["panchkula"],
  },

  // --- Uttar Pradesh Tier-2 / Tier-3 ---
  {
    city: "Meerut",
    state: "Uttar Pradesh",
    tier: "TIER_2",
    aliases: ["meerut", "modinagar", "partapur"],
  },
  {
    city: "Lucknow",
    state: "Uttar Pradesh",
    tier: "TIER_2",
    aliases: ["lucknow", "gomti nagar", "aliganj", "hazratganj"],
  },
  {
    city: "Kanpur",
    state: "Uttar Pradesh",
    tier: "TIER_2",
    aliases: ["kanpur", "cawnpore"],
  },
  {
    city: "Agra",
    state: "Uttar Pradesh",
    tier: "TIER_2",
    aliases: ["agra"],
  },
  {
    city: "Varanasi",
    state: "Uttar Pradesh",
    tier: "TIER_2",
    aliases: ["varanasi", "banaras", "kashi"],
  },
  {
    city: "Prayagraj",
    state: "Uttar Pradesh",
    tier: "TIER_2",
    aliases: ["prayagraj", "allahabad"],
  },
  {
    city: "Bareilly",
    state: "Uttar Pradesh",
    tier: "TIER_3",
    aliases: ["bareilly"],
  },
  {
    city: "Aligarh",
    state: "Uttar Pradesh",
    tier: "TIER_3",
    aliases: ["aligarh"],
  },
  {
    city: "Moradabad",
    state: "Uttar Pradesh",
    tier: "TIER_3",
    aliases: ["moradabad"],
  },
  {
    city: "Gorakhpur",
    state: "Uttar Pradesh",
    tier: "TIER_3",
    aliases: ["gorakhpur"],
  },
  {
    city: "Jhansi",
    state: "Uttar Pradesh",
    tier: "TIER_3",
    aliases: ["jhansi"],
  },

  // --- Madhya Pradesh Tier-2 / Tier-3 ---
  {
    city: "Indore",
    state: "Madhya Pradesh",
    tier: "TIER_2",
    aliases: ["indore", "vijay nagar", "palasia"],
  },
  {
    city: "Bhopal",
    state: "Madhya Pradesh",
    tier: "TIER_2",
    aliases: ["bhopal", "mp nagar"],
  },
  {
    city: "Gwalior",
    state: "Madhya Pradesh",
    tier: "TIER_2",
    aliases: ["gwalior"],
  },
  {
    city: "Jabalpur",
    state: "Madhya Pradesh",
    tier: "TIER_3",
    aliases: ["jabalpur"],
  },
  {
    city: "Ujjain",
    state: "Madhya Pradesh",
    tier: "TIER_3",
    aliases: ["ujjain"],
  },

  // --- Rajasthan Tier-2 / Tier-3 ---
  {
    city: "Jaipur",
    state: "Rajasthan",
    tier: "TIER_2",
    aliases: [
      "jaipur",
      "malviya nagar",
      "vaishali nagar",
      "mansarovar",
      "sitapura",
    ],
  },
  {
    city: "Jodhpur",
    state: "Rajasthan",
    tier: "TIER_2",
    aliases: ["jodhpur"],
  },
  {
    city: "Udaipur",
    state: "Rajasthan",
    tier: "TIER_2",
    aliases: ["udaipur"],
  },
  {
    city: "Kota",
    state: "Rajasthan",
    tier: "TIER_3",
    aliases: ["kota"],
  },
  {
    city: "Ajmer",
    state: "Rajasthan",
    tier: "TIER_3",
    aliases: ["ajmer"],
  },

  // --- Maharashtra Tier-2 / Tier-3 ---
  {
    city: "Nagpur",
    state: "Maharashtra",
    tier: "TIER_2",
    aliases: ["nagpur", "mihan"],
  },
  {
    city: "Nashik",
    state: "Maharashtra",
    tier: "TIER_2",
    aliases: ["nashik", "nasik"],
  },
  {
    city: "Aurangabad",
    state: "Maharashtra",
    tier: "TIER_3",
    aliases: ["aurangabad", "chhatrapati sambhajinagar"],
  },
  {
    city: "Kolhapur",
    state: "Maharashtra",
    tier: "TIER_3",
    aliases: ["kolhapur"],
  },

  // --- Punjab & Haryana Tier-2 / Tier-3 ---
  {
    city: "Ludhiana",
    state: "Punjab",
    tier: "TIER_2",
    aliases: ["ludhiana"],
  },
  {
    city: "Amritsar",
    state: "Punjab",
    tier: "TIER_2",
    aliases: ["amritsar"],
  },
  {
    city: "Jalandhar",
    state: "Punjab",
    tier: "TIER_2",
    aliases: ["jalandhar"],
  },
  {
    city: "Panipat",
    state: "Haryana",
    tier: "TIER_3",
    aliases: ["panipat"],
  },
  {
    city: "Karnal",
    state: "Haryana",
    tier: "TIER_3",
    aliases: ["karnal"],
  },
  {
    city: "Rohtak",
    state: "Haryana",
    tier: "TIER_3",
    aliases: ["rohtak"],
  },

  // --- Uttarakhand ---
  {
    city: "Dehradun",
    state: "Uttarakhand",
    tier: "TIER_2",
    aliases: ["dehradun", "doon"],
  },
  {
    city: "Haridwar",
    state: "Uttarakhand",
    tier: "TIER_3",
    aliases: ["haridwar", "sHandbook", "sIDCUL"],
  },
  {
    city: "Roorkee",
    state: "Uttarakhand",
    tier: "TIER_3",
    aliases: ["roorkee"],
  },

  // --- Bihar, Jharkhand, Odisha ---
  {
    city: "Patna",
    state: "Bihar",
    tier: "TIER_2",
    aliases: ["patna"],
  },
  {
    city: "Ranchi",
    state: "Jharkhand",
    tier: "TIER_2",
    aliases: ["ranchi"],
  },
  {
    city: "Jamshedpur",
    state: "Jharkhand",
    tier: "TIER_2",
    aliases: ["jamshedpur", "tatanagar"],
  },
  {
    city: "Bhubaneswar",
    state: "Odisha",
    tier: "TIER_2",
    aliases: ["bhubaneswar", "bbsr", "infocity"],
  },
  {
    city: "Cuttack",
    state: "Odisha",
    tier: "TIER_3",
    aliases: ["cuttack"],
  },

  // --- South Tier-2 ---
  {
    city: "Kochi",
    state: "Kerala",
    tier: "TIER_2",
    aliases: ["kochi", "cochin", "infopark", "kakkanad"],
  },
  {
    city: "Thiruvananthapuram",
    state: "Kerala",
    tier: "TIER_2",
    aliases: ["thiruvananthapuram", "trivandrum", "technopark"],
  },
  {
    city: "Coimbatore",
    state: "Tamil Nadu",
    tier: "TIER_2",
    aliases: ["coimbatore", "kovai", "tidel park coimbatore"],
  },
  {
    city: "Madurai",
    state: "Tamil Nadu",
    tier: "TIER_3",
    aliases: ["madurai"],
  },
  {
    city: "Mysuru",
    state: "Karnataka",
    tier: "TIER_2",
    aliases: ["mysuru", "mysore"],
  },
  {
    city: "Visakhapatnam",
    state: "Andhra Pradesh",
    tier: "TIER_2",
    aliases: ["visakhapatnam", "vizag"],
  },
  {
    city: "Vijayawada",
    state: "Andhra Pradesh",
    tier: "TIER_2",
    aliases: ["vijayawada"],
  },

  // --- Gujarat Tier-2 ---
  {
    city: "Ahmedabad",
    state: "Gujarat",
    tier: "TIER_1",
    aliases: ["ahmedabad", "gandhinagar", "gift city"],
  },
  {
    city: "Vadodara",
    state: "Gujarat",
    tier: "TIER_2",
    aliases: ["vadodara", "baroda"],
  },
  {
    city: "Surat",
    state: "Gujarat",
    tier: "TIER_2",
    aliases: ["surat"],
  },
  {
    city: "Rajkot",
    state: "Gujarat",
    tier: "TIER_3",
    aliases: ["rajkot"],
  },

  // --- Central & North-East ---
  {
    city: "Raipur",
    state: "Chhattisgarh",
    tier: "TIER_2",
    aliases: ["raipur"],
  },
  {
    city: "Guwahati",
    state: "Assam",
    tier: "TIER_2",
    aliases: ["guwahati", "gauhati"],
  },
];

/**
 * Regional clusters for nearby widening
 */
export const REGIONAL_CLUSTERS: Record<string, string[]> = {
  NCR: ["Noida", "Delhi", "Gurgaon", "Faridabad", "Ghaziabad"],
  MUMBAI_MMR: ["Mumbai", "Navi Mumbai", "Thane"],
  TRI_CITY: ["Chandigarh", "Mohali", "Panchkula"],
  PUNE_CLUSTER: ["Pune"],
  BENGALURU_CLUSTER: ["Bengaluru"],
  HYDERABAD_CLUSTER: ["Hyderabad"],
};
