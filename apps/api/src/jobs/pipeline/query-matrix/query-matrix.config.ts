export interface RoleCategoryConfig {
  category: string; // e.g. "software", "sales", "support", "back_office", "accounts", "marketing", "teaching"
  label: string;
  isTech: boolean;
  titles: string[];
  searchKeywords: string[];
}

export interface CityConfig {
  city: string;
  state: string;
  tier: "TIER_1" | "TIER_2" | "TIER_3";
}

export interface ExperienceBandConfig {
  band: "FRESHER" | "JUNIOR_0_2" | "MID_2_5";
  label: string;
  minExp: number;
  maxExp: number;
  synonyms: string[];
}

export const EXPERIENCE_BANDS: ExperienceBandConfig[] = [
  {
    band: "FRESHER",
    label: "Fresher / Intern (0-1y)",
    minExp: 0,
    maxExp: 1,
    synonyms: [
      "fresher",
      "trainee",
      "intern",
      "graduate trainee",
      "apprentice",
      "entry level",
    ],
  },
  {
    band: "JUNIOR_0_2",
    label: "Junior / Associate (0-2y)",
    minExp: 0,
    maxExp: 2,
    synonyms: ["junior", "associate", "executive", "assistant"],
  },
  {
    band: "MID_2_5",
    label: "Mid-Level (2-5y)",
    minExp: 2,
    maxExp: 5,
    synonyms: ["specialist", "experienced", "lead"],
  },
];

export const CITIES_CONFIG: CityConfig[] = [
  // Tier-2/3 Priority Hubs
  { city: "Meerut", state: "Uttar Pradesh", tier: "TIER_2" },
  { city: "Lucknow", state: "Uttar Pradesh", tier: "TIER_2" },
  { city: "Kanpur", state: "Uttar Pradesh", tier: "TIER_2" },
  { city: "Indore", state: "Madhya Pradesh", tier: "TIER_2" },
  { city: "Jaipur", state: "Rajasthan", tier: "TIER_2" },
  { city: "Bhopal", state: "Madhya Pradesh", tier: "TIER_2" },
  { city: "Nagpur", state: "Maharashtra", tier: "TIER_2" },
  { city: "Chandigarh", state: "Chandigarh (UT)", tier: "TIER_2" },
  { city: "Mohali", state: "Punjab", tier: "TIER_2" },
  { city: "Coimbatore", state: "Tamil Nadu", tier: "TIER_2" },
  { city: "Patna", state: "Bihar", tier: "TIER_2" },
  { city: "Bhubaneswar", state: "Odisha", tier: "TIER_2" },
  { city: "Kochi", state: "Kerala", tier: "TIER_2" },
  { city: "Varanasi", state: "Uttar Pradesh", tier: "TIER_3" },
  { city: "Agra", state: "Uttar Pradesh", tier: "TIER_3" },
  { city: "Vadodara", state: "Gujarat", tier: "TIER_2" },
  // Metros & Major Tech Centers
  { city: "Noida", state: "Uttar Pradesh", tier: "TIER_1" },
  { city: "Gurgaon", state: "Haryana", tier: "TIER_1" },
  { city: "Bengaluru", state: "Karnataka", tier: "TIER_1" },
  { city: "Pune", state: "Maharashtra", tier: "TIER_1" },
  { city: "Hyderabad", state: "Telangana", tier: "TIER_1" },
  { city: "Mumbai", state: "Maharashtra", tier: "TIER_1" },
  { city: "Delhi", state: "Delhi", tier: "TIER_1" },
];

export const ROLE_CATEGORIES: RoleCategoryConfig[] = [
  // 1. Tech & Software
  {
    category: "software_engineering",
    label: "Software Engineering",
    isTech: true,
    titles: [
      "Software Engineer",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Python Developer",
      "React Developer",
    ],
    searchKeywords: [
      "software engineer",
      "frontend developer",
      "backend developer",
      "python developer",
      "react developer",
    ],
  },
  {
    category: "qa_testing",
    label: "QA & Software Testing",
    isTech: true,
    titles: [
      "QA Engineer",
      "Software Tester",
      "Manual Tester",
      "Automation Tester",
    ],
    searchKeywords: ["software tester", "qa engineer", "quality assurance"],
  },
  {
    category: "data_analytics",
    label: "Data & Business Analytics",
    isTech: true,
    titles: ["Data Analyst", "Business Analyst", "Data Engineer"],
    searchKeywords: ["data analyst", "business analyst"],
  },

  // 2. Non-IT & Regional SME Supply (Crucial for Tier-2/3 Local Freshers)
  {
    category: "sales_bd",
    label: "Sales & Business Development",
    isTech: false,
    titles: [
      "Sales Executive",
      "Business Development Executive",
      "Inside Sales Executive",
      "Field Sales Officer",
    ],
    searchKeywords: [
      "sales executive",
      "business development executive",
      "bde",
      "sales trainee",
    ],
  },
  {
    category: "customer_support",
    label: "Customer Support & Operations",
    isTech: false,
    titles: [
      "Customer Support Executive",
      "Customer Care Executive",
      "Telecaller",
      "Voice Process Executive",
    ],
    searchKeywords: [
      "customer support executive",
      "customer care",
      "telecaller",
      "voice process",
    ],
  },
  {
    category: "back_office",
    label: "Back Office & Data Entry",
    isTech: false,
    titles: [
      "Back Office Executive",
      "Data Entry Operator",
      "Office Assistant",
      "Computer Operator",
    ],
    searchKeywords: [
      "back office executive",
      "data entry operator",
      "computer operator",
    ],
  },
  {
    category: "accounts_finance",
    label: "Accounts & Commercial Finance",
    isTech: false,
    titles: [
      "Accountant",
      "Accounts Executive",
      "Junior Accountant",
      "Tally Operator",
      "Billing Executive",
    ],
    searchKeywords: [
      "accountant",
      "accounts executive",
      "tally operator",
      "billing executive",
    ],
  },
  {
    category: "digital_marketing",
    label: "Digital Marketing & Content",
    isTech: false,
    titles: [
      "Digital Marketing Executive",
      "SEO Executive",
      "Social Media Executive",
      "Content Writer",
    ],
    searchKeywords: [
      "digital marketing executive",
      "seo executive",
      "content writer",
    ],
  },
  {
    category: "teaching_training",
    label: "Teaching, Training & Counseling",
    isTech: false,
    titles: ["Academic Counselor", "Teacher", "Computer Trainer", "Faculty"],
    searchKeywords: ["academic counselor", "computer trainer", "faculty"],
  },
];
