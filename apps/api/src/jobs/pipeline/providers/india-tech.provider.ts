import { Injectable } from "@nestjs/common";
import { IJobProvider, JobProviderQueryParams } from "./job-provider.interface";
import { RawJobInput } from "../types/job-pipeline.types";

@Injectable()
export class IndiaTechJobProvider implements IJobProvider {
  readonly providerName = "INDIA_TECH";

  async fetchJobs(params?: JobProviderQueryParams): Promise<RawJobInput[]> {
    const rawJobs: RawJobInput[] = [
      // =========================================================================
      // CATEGORY 1: INDIAN STARTUPS & SCALEUPS — INTERNSHIPS (ENGINEERING & TECH)
      // =========================================================================
      {
        externalId: "zepto-intern-sde-01",
        source: "COMPANY",
        title: "Software Engineering Intern (Backend / Node.js & Go)",
        companyName: "Zepto",
        companyWebsite: "https://www.zeptonow.com",
        companyLogo: "https://www.zeptonow.com/favicon.ico",
        location: "Bangalore, India",
        workMode: "HYBRID",
        employmentType: "INTERNSHIP",
        experienceMinYears: 0,
        experienceMaxYears: 1,
        salaryMin: 50000,
        salaryMax: 75000,
        currency: "INR",
        salaryPeriod: "MONTHLY",
        description: `### About Zepto
Zepto is India's fastest-growing quick-commerce unicorn delivering groceries and daily essentials in 10 minutes across top metropolitan cities.

### Key Responsibilities
- Work directly on dark-store inventory dispatch algorithms and rider batching microservices.
- Write clean, asynchronous code in Node.js, Go, or Python with unit test coverage >80%.
- Optimize database queries on PostgreSQL and caching keys on Redis for high-concurrency order spikes.
- Collaborate with tech leads on system design, telemetry tracking, and Grafana monitoring.

### Qualifications
- B.Tech/B.E./M.Tech student (graduating 2026/2027) in Computer Science or self-taught developer.
- Strong command of Data Structures, Algorithms, and Object-Oriented Programming.
- Familiarity with RESTful APIs, Git, PostgreSQL, and Node.js or Go.

### Perks & Conversion
- Monthly stipend: ₹50,000 - ₹75,000.
- Fast-track Pre-Placement Offer (PPO) for full-time SDE-1 (CTC ₹18L - ₹26L).
- Free food and coffee at Bangalore HQ, flexible hybrid work.`,
        applyUrl: "https://www.zeptonow.com/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
        skillsRaw: [
          "Node.js",
          "Go",
          "PostgreSQL",
          "Redis",
          "Data Structures",
          "Git",
          "REST",
        ],
      },
      {
        externalId: "swiggy-intern-consumer-02",
        source: "COMPANY",
        title: "Software Development Engineer (SDE) Intern - Frontend",
        companyName: "Swiggy",
        companyWebsite: "https://swiggy.com",
        companyLogo: "https://careers.swiggy.com/favicon.ico",
        location: "Bangalore, India",
        workMode: "HYBRID",
        employmentType: "INTERNSHIP",
        experienceMinYears: 0,
        experienceMaxYears: 1,
        salaryMin: 45000,
        salaryMax: 65000,
        currency: "INR",
        salaryPeriod: "MONTHLY",
        description: `### About Swiggy
Swiggy is India's pioneer on-demand convenience platform powering Food Delivery, Instamart, Dineout, and Genie for over 50 million consumers.

### Responsibilities
- Build responsive, accessible UI components for the Swiggy Web and mobile web client using React, Next.js, and TypeScript.
- Profile and optimize Core Web Vitals (LCP, INP, CLS) to achieve instant page transitions on 4G networks.
- Integrate REST and GraphQL endpoints with client state management libraries.

### Requirements
- Final or pre-final year college student pursuing B.Tech/MCA in Computer Science or IT.
- Solid understanding of JavaScript (ES6+), TypeScript, React, and CSS architecture.
- Passion for smooth micro-interactions, responsive web design, and UI performance.

### Benefits
- ₹45,000 - ₹65,000 monthly stipend.
- Swiggy One corporate perks, daily food credits, and direct PPO evaluation.`,
        applyUrl: "https://careers.swiggy.com/",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
        skillsRaw: [
          "React",
          "TypeScript",
          "Next.js",
          "JavaScript",
          "HTML5",
          "CSS3",
          "REST",
        ],
      },
      {
        externalId: "cred-intern-fullstack-03",
        source: "COMPANY",
        title: "Engineering Intern - Mobile & Web Products",
        companyName: "CRED",
        companyWebsite: "https://cred.club",
        companyLogo: "https://cred.club/favicon.ico",
        location: "Bangalore, India",
        workMode: "ONSITE",
        employmentType: "INTERNSHIP",
        experienceMinYears: 0,
        experienceMaxYears: 1,
        salaryMin: 60000,
        salaryMax: 85000,
        currency: "INR",
        salaryPeriod: "MONTHLY",
        description: `### About CRED
CRED is an exclusive community of creditworthy individuals offering high-frequency UPI payments, digital credit, and curated luxury commerce.

### Responsibilities
- Develop fluid 60fps animations and micro-interactions in React Native and React for CRED member workflows.
- Collaborate with backend engineers to consume event-driven microservices via gRPC and REST.
- Write automated UI unit and snapshot tests to ensure zero regressions across mobile screen sizes.

### Requirements
- Student enrolled in Computer Science or related engineering degree.
- Exceptional design sensitivity and craftsmanship in code.
- Strong proficiency in JavaScript/TypeScript, React or React Native, and CSS.

### Perks
- ₹60,000 - ₹85,000 monthly stipend.
- Gourmet meals, barista coffee, state-of-the-art office in Indiranagar, Bangalore.
- High conversion rate to full-time member engineering roles (top 1% CTC).`,
        applyUrl: "https://cred.club/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
        skillsRaw: [
          "React",
          "React Native",
          "TypeScript",
          "UI/UX",
          "CSS",
          "JavaScript",
        ],
      },
      {
        externalId: "razorpay-intern-backend-04",
        source: "COMPANY",
        title: "SDE Intern - Payment Gateways & Banking Tech",
        companyName: "Razorpay",
        companyWebsite: "https://razorpay.com",
        companyLogo: "https://razorpay.com/favicon.ico",
        location: "Bangalore, India",
        workMode: "HYBRID",
        employmentType: "INTERNSHIP",
        experienceMinYears: 0,
        experienceMaxYears: 1,
        salaryMin: 50000,
        salaryMax: 70000,
        currency: "INR",
        salaryPeriod: "MONTHLY",
        description: `### About Razorpay
Razorpay powers seamless payment acceptance, neo-banking, and payroll for millions of businesses, startups, and merchants across India.

### Key Responsibilities
- Implement high-reliability payment webhook listeners and retry queues using Go and Node.js.
- Ensure strict ACID guarantees and financial ledger reconciliation across PostgreSQL and Kafka.
- Write unit, integration, and load tests to benchmark TPS during festive sale events.

### Qualifications
- Pursuing B.Tech/M.Tech in CS/IT or self-taught developer with strong algorithmic foundations.
- Proficiency in Go, Java, Python, or TypeScript.
- Basic understanding of relational databases and HTTP/REST communication.

### Perks
- ₹50,000 - ₹70,000 monthly stipend.
- Fast-track PPO interview for full-time SDE-1 position (CTC ₹18L - ₹25L).
- Top engineering mentorship and book/course allowance.`,
        applyUrl: "https://razorpay.com/jobs/",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
        skillsRaw: [
          "Go",
          "Node.js",
          "PostgreSQL",
          "Kafka",
          "Data Structures",
          "Algorithms",
          "Git",
        ],
      },
      {
        externalId: "juspay-intern-fp-05",
        source: "COMPANY",
        title: "Backend Systems Intern (Functional Programming & Rust/Node)",
        companyName: "Juspay",
        companyWebsite: "https://juspay.in",
        companyLogo: "https://juspay.in/favicon.ico",
        location: "Bangalore, India",
        workMode: "ONSITE",
        employmentType: "INTERNSHIP",
        experienceMinYears: 0,
        experienceMaxYears: 1,
        salaryMin: 40000,
        salaryMax: 60000,
        currency: "INR",
        salaryPeriod: "MONTHLY",
        description: `### About Juspay
Juspay is the engineering backbone of India's UPI ecosystem, processing over 120 million daily transactions for Amazon, Swiggy, Flipkart, and CRED.

### Responsibilities
- Architect zero-downtime, fault-tolerant payment microservices using Functional Programming (Rust, Haskell, PureScript, Node.js).
- Write low-latency code handling concurrent banking switches and NPCI networks.
- Learn and apply strict type-driven development and category theory concepts to financial systems.

### Qualifications
- B.Tech/B.E. student with strong algorithmic thinking and passion for Functional Programming.
- Deep curiosity about how distributed systems, database transactions, and network switches operate.

### Benefits
- ₹40,000 - ₹60,000 monthly stipend.
- World-class FP mentorship from pioneer engineers.
- High conversion PPO to full-time Systems Engineer (CTC ₹16L - ₹27L).`,
        applyUrl: "https://juspay.in/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        skillsRaw: [
          "Rust",
          "Node.js",
          "Data Structures",
          "Algorithms",
          "PostgreSQL",
          "Functional Programming",
        ],
      },
      {
        externalId: "groww-intern-backend-06",
        source: "COMPANY",
        title: "Backend Engineering Intern - Stock Trading & Mutual Funds",
        companyName: "Groww",
        companyWebsite: "https://groww.in",
        companyLogo: "https://groww.in/favicon.ico",
        location: "Bangalore, India",
        workMode: "HYBRID",
        employmentType: "INTERNSHIP",
        experienceMinYears: 0,
        experienceMaxYears: 1,
        salaryMin: 45000,
        salaryMax: 65000,
        currency: "INR",
        salaryPeriod: "MONTHLY",
        description: `### About Groww
Groww is India's leading stock broking and wealth management platform, empowering over 45 million Indians to invest in equities, mutual funds, and IPOs.

### Responsibilities
- Build scalable microservices in Java/Spring Boot and Go to process real-time stock market orders.
- Integrate with stock exchange feeds (NSE/BSE) and optimize database indices on PostgreSQL.
- Implement alerting and telemetry dashboards with Prometheus and Grafana.

### Requirements
- Final/pre-final year student in Computer Science or IT.
- Strong problem-solving skills in Java, Python, or Go.
- Sound understanding of relational database schema design and ACID properties.

### Perks
- ₹45,000 - ₹65,000 monthly stipend.
- Pre-placement offer (PPO) opportunity for SDE-1 roles (CTC ₹16L - ₹22L).
- Subsidized meals and collaborative startup culture at Bangalore office.`,
        applyUrl: "https://groww.in/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 16),
        skillsRaw: [
          "Java",
          "Spring Boot",
          "Go",
          "PostgreSQL",
          "Kafka",
          "Data Structures",
        ],
      },
      {
        externalId: "slice-intern-sde-07",
        source: "COMPANY",
        title: "SDE Intern - Consumer Credit & Payments",
        companyName: "Slice",
        companyWebsite: "https://www.sliceit.com",
        companyLogo: "https://www.sliceit.com/favicon.ico",
        location: "Bangalore, India",
        workMode: "HYBRID",
        employmentType: "INTERNSHIP",
        experienceMinYears: 0,
        experienceMaxYears: 1,
        salaryMin: 45000,
        salaryMax: 65000,
        currency: "INR",
        salaryPeriod: "MONTHLY",
        description: `### About Slice
Slice is a leading Indian fintech company reimagining consumer payments, digital banking, and credit cards for India's youth.

### Responsibilities
- Work alongside senior engineers to develop core UPI mandate and transaction processing microservices.
- Write robust unit and functional tests in Node.js and TypeScript.
- Profile and improve API latency benchmarks across high-traffic microservices.

### Qualifications
- Pursuing B.Tech/B.E. in CS/IT.
- Experience with JavaScript, TypeScript, and Node.js.
- Familiarity with MongoDB or PostgreSQL and Git workflows.

### Perks
- ₹45,000 - ₹65,000 monthly stipend.
- PPO conversion opportunity for full-time SDE-1 roles (CTC ₹15L - ₹22L).
- Hybrid working environment with friendly startup teammates.`,
        applyUrl: "https://www.sliceit.com/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 14),
        skillsRaw: [
          "Node.js",
          "TypeScript",
          "PostgreSQL",
          "MongoDB",
          "Git",
          "REST",
        ],
      },
      {
        externalId: "meesho-intern-sde-08",
        source: "COMPANY",
        title: "SDE Intern - Search & Recommendation Systems",
        companyName: "Meesho",
        companyWebsite: "https://meesho.io",
        companyLogo: "https://meesho.io/favicon.ico",
        location: "Bangalore, India",
        workMode: "REMOTE",
        employmentType: "INTERNSHIP",
        experienceMinYears: 0,
        experienceMaxYears: 1,
        salaryMin: 50000,
        salaryMax: 75000,
        currency: "INR",
        salaryPeriod: "MONTHLY",
        description: `### About Meesho
Meesho is India's fastest-growing social e-commerce marketplace, democratizing internet commerce for over 150 million Bharat users.

### Responsibilities
- Contribute to product search ranking pipelines using Java, Spring Boot, and Elasticsearch.
- Build automated data processing jobs on Kafka and Spark streaming.
- Implement telemetry monitors to track query latency and user engagement.

### Requirements
- Pre-final or final year engineering student.
- Strong coding skills in Java, Python, or Go with solid data structure foundations.
- Hunger to learn large-scale distributed systems and high-throughput databases.

### Benefits
- ₹50,000 - ₹75,000 monthly stipend.
- 100% remote-first work environment with home office setup budget.
- Mentorship and direct PPO conversion pathway.`,
        applyUrl: "https://meesho.io/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
        skillsRaw: [
          "Java",
          "Python",
          "Elasticsearch",
          "Data Structures",
          "Spring Boot",
          "SQL",
        ],
      },
      {
        externalId: "urbancompany-intern-sde-09",
        source: "COMPANY",
        title: "Software Engineering Intern - Marketplace Platforms",
        companyName: "Urban Company",
        companyWebsite: "https://www.urbancompany.com",
        companyLogo: "https://www.urbancompany.com/favicon.ico",
        location: "Gurgaon, India",
        workMode: "HYBRID",
        employmentType: "INTERNSHIP",
        experienceMinYears: 0,
        experienceMaxYears: 1,
        salaryMin: 40000,
        salaryMax: 60000,
        currency: "INR",
        salaryPeriod: "MONTHLY",
        description: `### About Urban Company
Urban Company is Asia's largest home services marketplace, delivering beauty, wellness, cleaning, and appliance repair to over 10 million households.

### Responsibilities
- Develop features for service partner onboarding and automated training dashboards in React and Node.js.
- Optimize SQL queries on PostgreSQL and implement Redis caching to speed up booking allocations.
- Write unit and integration tests to maintain high code quality.

### Requirements
- Enrolled in B.Tech/MCA in Computer Science or related field.
- Hands-on experience with JavaScript, React, Node.js, and relational databases.
- Strong problem-solving mindset and collaborative team spirit.

### Perks
- ₹40,000 - ₹60,000 monthly stipend.
- Direct path to full-time SDE-1 hiring (CTC ₹14L - ₹20L).
- Subsidized meals at Gurgaon office and healthcare benefits.`,
        applyUrl: "https://www.urbancompany.com/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 22),
        skillsRaw: [
          "React",
          "Node.js",
          "JavaScript",
          "PostgreSQL",
          "Git",
          "REST",
        ],
      },
      {
        externalId: "postman-intern-devtools-10",
        source: "COMPANY",
        title: "Software Engineering Intern - Developer Tools & API",
        companyName: "Postman",
        companyWebsite: "https://www.postman.com",
        companyLogo: "https://www.postman.com/favicon.ico",
        location: "Bangalore, India",
        workMode: "HYBRID",
        employmentType: "INTERNSHIP",
        experienceMinYears: 0,
        experienceMaxYears: 1,
        salaryMin: 60000,
        salaryMax: 80000,
        currency: "INR",
        salaryPeriod: "MONTHLY",
        description: `### About Postman
Postman is the world's leading API platform used by over 30 million developers and 500,000 organizations to design, build, and test modern APIs.

### Responsibilities
- Build productivity features for the Postman desktop and web clients using Electron, React, and TypeScript.
- Work on API client request execution, mock servers, and test runners.
- Benchmark memory utilization and render performance on large API collection trees.

### Requirements
- Currently enrolled in CS or IT degree.
- Solid understanding of JavaScript, TypeScript, asynchronous programming, and HTTP protocols.
- Genuine enthusiasm for building developer tools and open-source software.

### Perks
- ₹60,000 - ₹80,000 monthly stipend.
- Ergonomic equipment provided, remote flexibility, and strong PPO conversion rate.`,
        applyUrl: "https://www.postman.com/company/careers/open-positions/",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 10),
        skillsRaw: [
          "TypeScript",
          "JavaScript",
          "React",
          "Node.js",
          "Electron",
          "REST",
          "Git",
        ],
      },
      {
        externalId: "browserstack-intern-infra-11",
        source: "COMPANY",
        title: "Software Engineering Intern - Cloud & Test Infrastructure",
        companyName: "BrowserStack",
        companyWebsite: "https://browserstack.com",
        companyLogo: "https://browserstack.com/favicon.ico",
        location: "Mumbai, India",
        workMode: "HYBRID",
        employmentType: "INTERNSHIP",
        experienceMinYears: 0,
        experienceMaxYears: 1,
        salaryMin: 50000,
        salaryMax: 70000,
        currency: "INR",
        salaryPeriod: "MONTHLY",
        description: `### About BrowserStack
BrowserStack is the global leader in software testing, powering more than 2 million tests every day across 15 global data centers for customers like Microsoft and Twitter.

### Responsibilities
- Automate testing frameworks and cloud orchestration scripts using Python and Go.
- Help monitor and troubleshoot containerized browser environments running on Kubernetes.
- Write tools to analyze crash dumps and performance metrics across mobile devices.

### Requirements
- Degree in Computer Science, Information Technology, or relevant discipline.
- Strong programming fundamentals in Python, Java, or C++.
- Good understanding of Linux operating system concepts and networking.

### Perks
- ₹50,000 - ₹70,000 monthly stipend.
- Office in Mumbai with free lunch, gym, and high-conversion PPO potential.`,
        applyUrl: "https://www.browserstack.com/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
        skillsRaw: [
          "Python",
          "Go",
          "Linux",
          "Docker",
          "Kubernetes",
          "Data Structures",
        ],
      },
      {
        externalId: "zomato-intern-web-12",
        source: "COMPANY",
        title: "Frontend Engineering Intern - Consumer Web Apps",
        companyName: "Zomato",
        companyWebsite: "https://zomato.com",
        companyLogo: "https://zomato.com/favicon.ico",
        location: "Gurgaon, India",
        workMode: "ONSITE",
        employmentType: "INTERNSHIP",
        experienceMinYears: 0,
        experienceMaxYears: 1,
        salaryMin: 45000,
        salaryMax: 65000,
        currency: "INR",
        salaryPeriod: "MONTHLY",
        description: `### About Zomato
Zomato is one of India's most beloved consumer internet platforms, connecting millions of customers with restaurants and delivery partners across India.

### Responsibilities
- Build performant user interfaces for Zomato web and mobile platforms using React and modern CSS.
- Collaborate with backend engineers to define and integrate RESTful APIs and GraphQL queries.
- Participate in UI component library development and automated visual regression testing.

### Requirements
- Final or pre-final year college student.
- Strong knowledge of JavaScript, TypeScript, HTML5, and CSS3.
- Familiarity with React, Next.js, and state management.

### Benefits
- ₹45,000 - ₹65,000 monthly stipend.
- Daily subsidized meals at Zomato HQ in Gurgaon, fitness facilities, and PPO potential.`,
        applyUrl: "https://www.zomato.com/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
        skillsRaw: [
          "React",
          "TypeScript",
          "JavaScript",
          "HTML5",
          "CSS3",
          "Next.js",
          "GraphQL",
        ],
      },
      {
        externalId: "phonepe-intern-core-13",
        source: "COMPANY",
        title: "Software Engineer Intern - Core Payments",
        companyName: "PhonePe",
        companyWebsite: "https://phonepe.com",
        companyLogo: "https://phonepe.com/favicon.ico",
        location: "Bangalore, India",
        workMode: "HYBRID",
        employmentType: "INTERNSHIP",
        experienceMinYears: 0,
        experienceMaxYears: 1,
        salaryMin: 55000,
        salaryMax: 75000,
        currency: "INR",
        salaryPeriod: "MONTHLY",
        description: `### About PhonePe
PhonePe is India's leading digital payments and financial services platform, processing over 45% of all UPI transactions in the country.

### Responsibilities
- Build and maintain mission-critical payment processing microservices with zero downtime.
- Write high-concurrency Java and Spring Boot code interacting with banking switches and NPCI networks.
- Conduct load tests and optimize SQL query plans.

### Qualifications
- B.Tech/M.Tech student graduating in 2026/2027.
- Excellent algorithmic knowledge and understanding of OS and DB internals.
- Hands-on experience in Java, C++, or Python.

### Perks
- ₹55,000 - ₹75,000 monthly stipend.
- Comprehensive health insurance, relocation support, and PPO opportunity.`,
        applyUrl: "https://phonepe.com/careers/",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 32),
        skillsRaw: [
          "Java",
          "Spring Boot",
          "Data Structures",
          "MySQL",
          "Kafka",
          "Algorithms",
        ],
      },
      {
        externalId: "jar-intern-backend-14",
        source: "COMPANY",
        title: "Backend Engineering Intern - Micro-Savings & Gold",
        companyName: "Jar",
        companyWebsite: "https://myjar.app",
        companyLogo: "https://myjar.app/favicon.ico",
        location: "Bangalore, India",
        workMode: "HYBRID",
        employmentType: "INTERNSHIP",
        experienceMinYears: 0,
        experienceMaxYears: 1,
        salaryMin: 40000,
        salaryMax: 60000,
        currency: "INR",
        salaryPeriod: "MONTHLY",
        description: `### About Jar
Jar is India's pioneering micro-savings startup, helping over 15 million Indians save in 24k digital gold with spare change rounding algorithms.

### Responsibilities
- Build and scale transaction round-off workers using Go, Node.js, and Redis.
- Integrate with UPI AutoPay protocols and payment aggregators.
- Optimize PostgreSQL database tables for high-frequency daily savings transactions.

### Qualifications
- Student pursuing B.Tech/B.E. in Computer Science.
- Solid understanding of Go, Node.js, or Python.
- Good knowledge of relational databases and Git.

### Perks
- ₹40,000 - ₹60,000 monthly stipend.
- Work directly with founders and senior architects in Koramangala, Bangalore.
- High conversion PPO potential to SDE-1 (CTC ₹14L - ₹20L).`,
        applyUrl: "https://myjar.app/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
        skillsRaw: [
          "Go",
          "Node.js",
          "PostgreSQL",
          "Redis",
          "Data Structures",
          "REST",
        ],
      },
      {
        externalId: "jupiter-intern-android-15",
        source: "COMPANY",
        title: "Android Engineering Intern - Neobanking",
        companyName: "Jupiter",
        companyWebsite: "https://jupiter.money",
        companyLogo: "https://jupiter.money/favicon.ico",
        location: "Bangalore, India",
        workMode: "HYBRID",
        employmentType: "INTERNSHIP",
        experienceMinYears: 0,
        experienceMaxYears: 1,
        salaryMin: 45000,
        salaryMax: 65000,
        currency: "INR",
        salaryPeriod: "MONTHLY",
        description: `### About Jupiter
Jupiter is a smart digital banking startup empowering users with automated savings, mutual funds, and real-time expense tracking.

### Responsibilities
- Build intuitive Android banking workflows using Kotlin, Jetpack Compose, and Coroutines.
- Implement robust local caching with Room database and offline synchronization.
- Collaborate with designers on micro-animations and accessibility standards.

### Requirements
- Strong knowledge of Kotlin, Android SDK, and modern architecture patterns (MVVM/MVI).
- Passion for crafting polished fintech mobile apps with zero crashes.

### Perks
- ₹45,000 - ₹65,000 monthly stipend.
- Office in Bangalore with free snacks, games room, and PPO opportunities.`,
        applyUrl: "https://jupiter.money/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        skillsRaw: [
          "Kotlin",
          "Android",
          "Jetpack Compose",
          "Coroutines",
          "Git",
          "REST",
        ],
      },
      {
        externalId: "shiprocket-intern-sde-16",
        source: "COMPANY",
        title: "Software Engineering Intern - Logistics & Shipping Tech",
        companyName: "Shiprocket",
        companyWebsite: "https://shiprocket.in",
        companyLogo: "https://shiprocket.in/favicon.ico",
        location: "Gurgaon, India",
        workMode: "HYBRID",
        employmentType: "INTERNSHIP",
        experienceMinYears: 0,
        experienceMaxYears: 1,
        salaryMin: 35000,
        salaryMax: 50000,
        currency: "INR",
        salaryPeriod: "MONTHLY",
        description: `### About Shiprocket
Shiprocket is India's leading e-commerce enablement and logistics platform powering shipping for over 100,000 direct-to-consumer (D2C) brands.

### Responsibilities
- Work on automated carrier assignment and shipping label generation microservices.
- Write clean Python/Django and Node.js backend APIs with automated unit tests.
- Analyze logistics tracking webhook events and update order lifecycle statuses.

### Requirements
- Final or pre-final year engineering student.
- Good knowledge of Python, Node.js, and SQL databases.
- Strong analytical problem-solving skills.

### Perks
- ₹35,000 - ₹50,000 monthly stipend.
- PPO consideration for full-time Associate Software Engineer roles.
- Modern Gurgaon office and mentoring from experienced logistics architects.`,
        applyUrl: "https://shiprocket.in/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 28),
        skillsRaw: ["Python", "Node.js", "Django", "PostgreSQL", "Git", "REST"],
      },
      {
        externalId: "pw-intern-edtech-17",
        source: "COMPANY",
        title: "Full Stack Engineering Intern - Live Learning Platform",
        companyName: "PhysicsWallah",
        companyWebsite: "https://www.pw.live",
        companyLogo: "https://www.pw.live/favicon.ico",
        location: "Noida, India",
        workMode: "HYBRID",
        employmentType: "INTERNSHIP",
        experienceMinYears: 0,
        experienceMaxYears: 1,
        salaryMin: 35000,
        salaryMax: 50000,
        currency: "INR",
        salaryPeriod: "MONTHLY",
        description: `### About PhysicsWallah (PW)
PhysicsWallah is India's most affordable and impactful EdTech unicorn, teaching over 30 million students through digital classrooms and test prep apps.

### Responsibilities
- Build features for live video lectures, doubt resolution chats, and automated quiz evaluations.
- Work with React, Next.js, Node.js, and WebSockets to handle concurrent student batches.
- Optimize video streaming playback and test player latency across slow network connections.

### Requirements
- Final/pre-final year student in Computer Science or IT.
- Proficiency in JavaScript/TypeScript, React, and Node.js.
- Passion for democratizing quality education across India.

### Perks
- ₹35,000 - ₹50,000 monthly stipend.
- Office in Sector 62, Noida with PPO conversion opportunity.`,
        applyUrl: "https://www.pw.live/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
        skillsRaw: [
          "React",
          "Next.js",
          "Node.js",
          "TypeScript",
          "WebSockets",
          "MongoDB",
        ],
      },
      {
        externalId: "sarvam-intern-ai-18",
        source: "COMPANY",
        title: "AI / ML Research Intern - Indic LLM Foundations",
        companyName: "Sarvam AI",
        companyWebsite: "https://www.sarvam.ai",
        companyLogo: "https://www.sarvam.ai/favicon.ico",
        location: "Bangalore, India",
        workMode: "ONSITE",
        employmentType: "INTERNSHIP",
        experienceMinYears: 0,
        experienceMaxYears: 1,
        salaryMin: 60000,
        salaryMax: 90000,
        currency: "INR",
        salaryPeriod: "MONTHLY",
        description: `### About Sarvam AI
Sarvam AI is developing foundational AI and generative voice/text models built specifically for Indian languages and enterprise use cases.

### Responsibilities
- Clean, tokenize, and benchmark large-scale corpora in Hindi, Tamil, Telugu, and other Indian languages.
- Assist in training and evaluating transformer models using PyTorch on GPU clusters.
- Run ablation studies on quantization (AWQ/GPTQ) and model inference latency.

### Requirements
- Pursuing B.Tech/M.Tech/PhD in CS, AI/ML, or related quantitative field.
- Strong coding skills in Python and PyTorch.
- Familiarity with Hugging Face transformers, attention mechanisms, and deep learning math.

### Perks
- ₹60,000 - ₹90,000 monthly stipend.
- Work alongside top AI scientists shaping India's sovereign AI mission.
- High conversion PPO to full-time AI Engineer (CTC ₹22L - ₹35L).`,
        applyUrl: "https://www.sarvam.ai/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
        skillsRaw: [
          "Python",
          "PyTorch",
          "Transformers",
          "Machine Learning",
          "LLM",
          "Deep Learning",
        ],
      },

      // =========================================================================
      // CATEGORY 2: INDIAN STARTUPS & SCALEUPS — SDE-1 / ENTRY LEVEL (0 - 2 YRS)
      // =========================================================================
      {
        externalId: "zerodha-sde1-01",
        source: "COMPANY",
        title: "Software Engineer I - Kite Trading Systems (Go & Python)",
        companyName: "Zerodha",
        companyWebsite: "https://zerodha.com",
        companyLogo: "https://zerodha.com/favicon.ico",
        location: "Bangalore, India",
        workMode: "ONSITE",
        employmentType: "FULL_TIME",
        experienceMinYears: 0,
        experienceMaxYears: 2,
        salaryMin: 1600000,
        salaryMax: 2400000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About Zerodha
Zerodha is India's largest discount broker, powering millions of orders per second on our Kite trading engine with a lean, pragmatic engineering team.

### Responsibilities
- Build lightweight, high-performance web applications and internal tools using Go, Python, and Vue.js.
- Work directly on Kite APIs, market data streams (WebSockets), and reporting services.
- Optimize database queries across PostgreSQL and ClickHouse for historical trade analysis.

### Requirements
- 0 to 2 years of software engineering experience or exceptional recent graduate.
- Strong fundamentals in Linux, HTTP protocols, networking, and relational databases.
- Pragmatic approach to technology: preferring simplicity, minimal dependencies, and high performance.

### Perks
- Annual CTC: ₹16,00,000 - ₹24,00,000 with generous performance bonuses.
- No corporate bureaucracy, healthy work-life balance, and free meals at Bangalore office.`,
        applyUrl: "https://zerodha.com/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 14),
        skillsRaw: [
          "Go",
          "Python",
          "PostgreSQL",
          "Vue.js",
          "Linux",
          "WebSockets",
          "Docker",
        ],
      },
      {
        externalId: "groww-sde1-backend-02",
        source: "COMPANY",
        title: "Software Development Engineer I (SDE-1) - Backend",
        companyName: "Groww",
        companyWebsite: "https://groww.in",
        companyLogo: "https://groww.in/favicon.ico",
        location: "Bangalore, India",
        workMode: "HYBRID",
        employmentType: "FULL_TIME",
        experienceMinYears: 1,
        experienceMaxYears: 2,
        salaryMin: 1500000,
        salaryMax: 2200000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About Groww
Groww is India's premier investment platform trusted by over 40 million retail investors for mutual funds, stocks, US investments, and credit lines.

### Responsibilities
- Develop secure, high-concurrency transaction services using Java/Spring Boot and Go.
- Ensure strict compliance with financial regulations, order routing safeguards, and audit logging.
- Monitor microservices health with Prometheus, Grafana, and ELK stack.

### Requirements
- 1-2 years of backend software engineering experience.
- Strong command of Data Structures, Algorithms, and SQL databases.
- Experience with Java, Spring Boot, or Go.

### Compensation
- Annual CTC: ₹15,00,000 - ₹22,00,000.
- Attractive ESOP options, medical benefits, and fast career progression.`,
        applyUrl: "https://groww.in/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
        skillsRaw: [
          "Java",
          "Spring Boot",
          "Go",
          "PostgreSQL",
          "Kafka",
          "Data Structures",
          "Docker",
        ],
      },
      {
        externalId: "slice-sde1-consumer-03",
        source: "COMPANY",
        title: "SDE 1 - Consumer App & UPI Payments",
        companyName: "Slice",
        companyWebsite: "https://www.sliceit.com",
        companyLogo: "https://www.sliceit.com/favicon.ico",
        location: "Bangalore, India",
        workMode: "HYBRID",
        employmentType: "FULL_TIME",
        experienceMinYears: 1,
        experienceMaxYears: 3,
        salaryMin: 1600000,
        salaryMax: 2400000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About Slice
Slice is a leading fintech company reimagining consumer payments, credit cards, and banking for India's youth.

### Responsibilities
- Build scalable payment microservices handling UPI mandates, card tokenization, and instant settlements.
- Write robust Node.js and Go microservices with comprehensive automated test suites.
- Integrate with partner banking APIs and credit underwriting systems.

### Requirements
- 1+ years of backend development experience.
- Proficient in Node.js, TypeScript, Go, or Python.
- Solid grasp of MongoDB, PostgreSQL, and Redis caching.

### Benefits
- CTC: ₹16,00,000 - ₹24,00,000.
- Flexible leave policy, comprehensive health coverage, and ESOPs.`,
        applyUrl: "https://www.sliceit.com/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
        skillsRaw: [
          "Node.js",
          "TypeScript",
          "Go",
          "PostgreSQL",
          "MongoDB",
          "Redis",
          "REST",
        ],
      },
      {
        externalId: "delhivery-sde1-logistics-04",
        source: "COMPANY",
        title: "Software Engineer I - Route Optimization & Geo Intelligence",
        companyName: "Delhivery",
        companyWebsite: "https://www.delhivery.com",
        companyLogo: "https://www.delhivery.com/favicon.ico",
        location: "Gurgaon, India",
        workMode: "HYBRID",
        employmentType: "FULL_TIME",
        experienceMinYears: 0,
        experienceMaxYears: 2,
        salaryMin: 1200000,
        salaryMax: 1800000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About Delhivery
Delhivery is India's largest fully integrated logistics services provider, handling more than 2 billion parcel shipments across 18,000+ pin codes.

### Responsibilities
- Design geospatial routing algorithms and package sorting microservices in Python and Go.
- Work with PostGIS and Redis to track vehicle telemetry and optimize transit hubs.
- Write automated tests and participate in sprint planning meetings.

### Requirements
- 0 to 2 years of software engineering experience.
- Strong proficiency in Python, Go, or Java.
- Solid knowledge of algorithms, graph theory, and SQL databases.

### Compensation
- CTC: ₹12,00,000 - ₹18,00,000.
- Comprehensive health insurance and relocation assistance to Gurgaon.`,
        applyUrl: "https://www.delhivery.com/careers/",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 28),
        skillsRaw: [
          "Python",
          "Go",
          "PostgreSQL",
          "Docker",
          "Algorithms",
          "Git",
        ],
      },
      {
        externalId: "clevertap-frontend1-05",
        source: "COMPANY",
        title: "Frontend Engineer 1 - Real-time Analytics Dashboards",
        companyName: "CleverTap",
        companyWebsite: "https://clevertap.com",
        companyLogo: "https://clevertap.com/favicon.ico",
        location: "Mumbai, India",
        workMode: "HYBRID",
        employmentType: "FULL_TIME",
        experienceMinYears: 1,
        experienceMaxYears: 3,
        salaryMin: 1400000,
        salaryMax: 2000000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About CleverTap
CleverTap is an AI-powered customer engagement and retention platform trusted by over 10,000 global consumer brands.

### Responsibilities
- Build real-time analytics dashboards, cohort visualizations, and campaign creators using React and TypeScript.
- Optimize rendering performance for large datasets (10,000+ data points) using canvas and SVG charting.
- Maintain accessible, reusable UI component library.

### Requirements
- 1-3 years of modern frontend engineering experience.
- Deep expertise in React, TypeScript, Redux/Zustand, and CSS modules.
- Passion for responsive, intuitive UI/UX design.

### Compensation
- Annual CTC: ₹14,00,000 - ₹20,00,000.
- Health insurance, hybrid work model, and performance incentives.`,
        applyUrl: "https://clevertap.com/careers/",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 22),
        skillsRaw: [
          "React",
          "TypeScript",
          "JavaScript",
          "HTML5",
          "CSS3",
          "REST",
          "TailwindCSS",
        ],
      },
      {
        externalId: "porter-sde1-06",
        source: "COMPANY",
        title: "SDE 1 - Intra-city Logistics & Fleet Matching",
        companyName: "Porter",
        companyWebsite: "https://porter.in",
        companyLogo: "https://porter.in/favicon.ico",
        location: "Bangalore, India",
        workMode: "HYBRID",
        employmentType: "FULL_TIME",
        experienceMinYears: 1,
        experienceMaxYears: 2,
        salaryMin: 1300000,
        salaryMax: 1900000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About Porter
Porter is India's largest on-demand logistics marketplace connecting thousands of businesses and individuals with mini-trucks and delivery partners.

### Responsibilities
- Build matching and fare calculation microservices using Node.js and Java.
- Optimize live GPS location stream ingestion from driver mobile devices.
- Work closely with operations teams to resolve system bottlenecks.

### Requirements
- 1-2 years of software engineering experience.
- Experience with Node.js, Java, or Python and MySQL/PostgreSQL.
- Understanding of caching with Redis and messaging with Kafka or RabbitMQ.

### Compensation
- Annual CTC: ₹13,00,000 - ₹19,00,000.
- ESOPs and comprehensive medical insurance.`,
        applyUrl: "https://porter.in/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        skillsRaw: [
          "Node.js",
          "Java",
          "MySQL",
          "Redis",
          "Kafka",
          "Data Structures",
        ],
      },
      {
        externalId: "lenskart-sde1-07",
        source: "COMPANY",
        title: "Software Engineer I - Omnichannel Retail Tech",
        companyName: "Lenskart",
        companyWebsite: "https://www.lenskart.com",
        companyLogo: "https://www.lenskart.com/favicon.ico",
        location: "Gurgaon, India",
        workMode: "HYBRID",
        employmentType: "FULL_TIME",
        experienceMinYears: 0,
        experienceMaxYears: 2,
        salaryMin: 1200000,
        salaryMax: 1800000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About Lenskart
Lenskart is India's premier eyewear unicorn operating over 2,000 retail stores and an international e-commerce platform across Asia and the Middle East.

### Responsibilities
- Develop point-of-sale (POS) and inventory replenishment microservices in Java and Node.js.
- Build 3D virtual try-on web features using WebGL and modern JavaScript.
- Maintain high code coverage with Jest and integration test frameworks.

### Requirements
- 0 to 2 years of software engineering experience.
- Proficiency in Java, Node.js, or React/TypeScript.
- Good understanding of databases (MySQL/PostgreSQL) and RESTful API architecture.

### Compensation
- Annual CTC: ₹12,00,000 - ₹18,00,000.
- Eyewear discounts, health coverage, and Gurgaon office perks.`,
        applyUrl: "https://www.lenskart.com/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 34),
        skillsRaw: ["Java", "Node.js", "React", "TypeScript", "MySQL", "REST"],
      },
      {
        externalId: "spinny-sde1-08",
        source: "COMPANY",
        title: "SDE 1 - Auto-Tech Inspection & Pricing Engine",
        companyName: "Spinny",
        companyWebsite: "https://www.spinny.com",
        companyLogo: "https://www.spinny.com/favicon.ico",
        location: "Gurgaon, India",
        workMode: "HYBRID",
        employmentType: "FULL_TIME",
        experienceMinYears: 1,
        experienceMaxYears: 3,
        salaryMin: 1400000,
        salaryMax: 2000000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About Spinny
Spinny is a leading Indian auto-tech unicorn offering a transparent and verified platform for buying and selling certified used cars.

### Responsibilities
- Build car valuation algorithms, inspection report generation, and financing microservices.
- Write robust Python (FastAPI/Django) and React code.
- Optimize relational database queries and automate CI/CD pipeline deployments.

### Requirements
- 1-3 years of software development experience.
- Strong knowledge of Python, Django/FastAPI, or Node.js.
- Experience with AWS, Docker, and PostgreSQL.

### Compensation
- CTC: ₹14,00,000 - ₹20,00,000.
- Health insurance, flexible leave policy, and Gurgaon campus perks.`,
        applyUrl: "https://www.spinny.com/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
        skillsRaw: [
          "Python",
          "FastAPI",
          "Django",
          "PostgreSQL",
          "Docker",
          "AWS",
          "Git",
        ],
      },
      {
        externalId: "moengage-sde1-09",
        source: "COMPANY",
        title: "Software Engineer - Customer Analytics & Data Pipelines",
        companyName: "MoEngage",
        companyWebsite: "https://moengage.com",
        companyLogo: "https://moengage.com/favicon.ico",
        location: "Bangalore, India",
        workMode: "HYBRID",
        employmentType: "FULL_TIME",
        experienceMinYears: 1,
        experienceMaxYears: 3,
        salaryMin: 1500000,
        salaryMax: 2200000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About MoEngage
MoEngage is an insights-led customer engagement platform used by consumer brands like Flipkart, Airtel, and Domino's across 35+ countries.

### Responsibilities
- Build event streaming microservices handling billions of customer events per day.
- Write high-performance Java and Python code with Redis and Kafka backends.
- Monitor query latency across distributed databases (MongoDB, ClickHouse).

### Requirements
- 1-3 years of backend engineering experience.
- Strong command of Java, Python, or Go.
- Hands-on experience with Kafka, Redis, and distributed systems.

### Compensation
- CTC: ₹15,00,000 - ₹22,00,000.
- Great work culture, health insurance, and learning reimbursement.`,
        applyUrl: "https://moengage.com/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
        skillsRaw: [
          "Java",
          "Python",
          "Kafka",
          "Redis",
          "MongoDB",
          "Distributed Systems",
        ],
      },
      {
        externalId: "darwinbox-sde1-10",
        source: "COMPANY",
        title: "Software Engineer I - Enterprise HR Tech Platform",
        companyName: "Darwinbox",
        companyWebsite: "https://darwinbox.com",
        companyLogo: "https://darwinbox.com/favicon.ico",
        location: "Hyderabad, India",
        workMode: "HYBRID",
        employmentType: "FULL_TIME",
        experienceMinYears: 1,
        experienceMaxYears: 3,
        salaryMin: 1200000,
        salaryMax: 1800000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About Darwinbox
Darwinbox is India's leading cloud HR technology unicorn serving over 2 million employees across 850+ enterprise organizations globally.

### Responsibilities
- Develop scalable enterprise modules for payroll processing, performance management, and attendance.
- Build responsive web interfaces in React and robust backend microservices in Node.js/PHP.
- Maintain high database performance across MySQL and MongoDB.

### Requirements
- 1-3 years of software development experience.
- Strong proficiency in Node.js, React, or Java.
- Sound understanding of relational database schema design and RESTful APIs.

### Compensation
- Annual CTC: ₹12,00,000 - ₹18,00,000.
- Health insurance, flexible hybrid policy in Hyderabad, and fast career growth.`,
        applyUrl: "https://darwinbox.com/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
        skillsRaw: [
          "Node.js",
          "React",
          "TypeScript",
          "MySQL",
          "MongoDB",
          "REST",
        ],
      },

      // =========================================================================
      // CATEGORY 3: INDIAN STARTUPS & SCALEUPS — MID & SENIOR TECH (3 - 6+ YRS)
      // =========================================================================
      {
        externalId: "zepto-staff-fleet-01",
        source: "COMPANY",
        title: "Staff Software Engineer - Supply Chain & Fleet Routing",
        companyName: "Zepto",
        companyWebsite: "https://www.zeptonow.com",
        companyLogo: "https://www.zeptonow.com/favicon.ico",
        location: "Bangalore, India",
        workMode: "HYBRID",
        employmentType: "FULL_TIME",
        experienceMinYears: 6,
        experienceMaxYears: 10,
        salaryMin: 4500000,
        salaryMax: 6500000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About Zepto Supply Chain
Zepto operates hundreds of dark stores across 10 major metropolitan cities, orchestrating inventory dispatch within 10 minutes.

### Key Responsibilities
- Define technical architecture for fleet management, dark store replenishment, and demand forecasting services.
- Drive engineering excellence across multiple squads, conducting high-level design reviews and mentoring tech leads.
- Pioneer resilience engineering to handle massive surge traffic during rain and festival peaks.

### Requirements
- 6+ years of software design and development experience in high-growth consumer or logistics companies.
- Proven experience building distributed systems in Go, Java, or Python.
- Deep expertise in system architecture, domain-driven design, and cloud infrastructure (AWS/GCP).

### Compensation
- Annual CTC: ₹45,00,000 - ₹65,00,000 + substantial equity grants.
- Comprehensive family health insurance and executive wellness benefits.`,
        applyUrl: "https://www.zeptonow.com/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 14),
        skillsRaw: [
          "Go",
          "Java",
          "Distributed Systems",
          "AWS",
          "Kafka",
          "PostgreSQL",
          "Docker",
          "Kubernetes",
        ],
      },
      {
        externalId: "razorpay-senior-frontend-02",
        source: "COMPANY",
        title: "Senior Frontend Engineer - Checkout & Core Payments",
        companyName: "Razorpay",
        companyWebsite: "https://razorpay.com",
        companyLogo: "https://razorpay.com/favicon.ico",
        location: "Bangalore, India",
        workMode: "HYBRID",
        employmentType: "FULL_TIME",
        experienceMinYears: 4,
        experienceMaxYears: 7,
        salaryMin: 2800000,
        salaryMax: 4200000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About Razorpay
Razorpay is India's leading fintech unicorn powering online and in-person payments for millions of businesses, processing hundreds of billions in annual transaction volume.

### Key Responsibilities
- Architect, build, and optimize the Razorpay Standard Checkout SDK used by over 500,000+ merchants across web and mobile browsers.
- Drive bundle size reduction to sub-80KB and achieve sub-second checkout render times across low-bandwidth 4G networks.
- Design accessible, cross-browser payment forms supporting UPI, Netbanking, Credit/Debit cards, EMI, and Wallets.

### Requirements & Qualifications
- 4+ years of hands-on frontend software engineering experience with JavaScript and TypeScript.
- Strong proficiency in React, Web Performance profiling (DevTools, Lighthouse), and browser networking.
- Experience building SDKs, widgets, or embeddable iframes with zero third-party script leakage.

### Benefits & Perks
- Market-leading CTC and ESOP equity grants.
- Medical insurance of ₹10,00,000 covering employee, spouse, children, and parents.
- Flexible hybrid working policy with home office reimbursement.`,
        applyUrl: "https://razorpay.com/jobs/",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 16),
        skillsRaw: [
          "React",
          "TypeScript",
          "JavaScript",
          "Next.js",
          "Web Performance",
          "REST",
        ],
      },
      {
        externalId: "cred-lead-ledger-03",
        source: "COMPANY",
        title: "Lead Backend Engineer - Distributed Financial Ledgers",
        companyName: "CRED",
        companyWebsite: "https://cred.club",
        companyLogo: "https://cred.club/favicon.ico",
        location: "Bangalore, India",
        workMode: "ONSITE",
        employmentType: "FULL_TIME",
        experienceMinYears: 4,
        experienceMaxYears: 8,
        salaryMin: 3600000,
        salaryMax: 5400000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About CRED
CRED is a transparent financial club of trustworthy individuals, offering credit card management, UPI peer payments, digital banking, and luxury commerce.

### Responsibilities
- Design, scale, and maintain high-throughput distributed transaction ledgers handling tens of thousands of requests per second.
- Implement strict ACID transactions, double-entry bookkeeping safeguards, and event-sourcing pipelines.
- Build fault-tolerant microservices with Go or Java/Kotlin, backed by PostgreSQL, DynamoDB, and Kafka.

### Requirements
- 4+ years of backend engineering experience building mission-critical distributed systems.
- Deep expertise in relational databases (PostgreSQL), index tuning, query plan analysis, and connection pooling.
- Hands-on experience with Kafka event streaming, Redis caching patterns, and Docker/Kubernetes container orchestration.

### What CRED Offers
- Top 1% compensation in the Indian tech ecosystem with wealth-generating ESOPs.
- Gourmet meals, barista coffee, and premium wellness facilities at CRED headquarters in Indiranagar.`,
        applyUrl: "https://cred.club/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
        skillsRaw: [
          "Go",
          "Node.js",
          "PostgreSQL",
          "Kafka",
          "Distributed Systems",
          "Redis",
          "Docker",
          "Kubernetes",
        ],
      },
      {
        externalId: "swiggy-sde2-platform-04",
        source: "COMPANY",
        title: "Software Development Engineer II (SDE-2) - Platform & Cloud",
        companyName: "Swiggy",
        companyWebsite: "https://swiggy.com",
        companyLogo: "https://careers.swiggy.com/favicon.ico",
        location: "Bangalore, India",
        workMode: "REMOTE",
        employmentType: "FULL_TIME",
        experienceMinYears: 3,
        experienceMaxYears: 6,
        salaryMin: 2600000,
        salaryMax: 3800000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About Swiggy Platform
Our platform engineering team builds core message brokers, service meshes, and deployment pipelines supporting thousands of production microservices.

### Responsibilities
- Architect high-throughput backend services in Go and Java handling millions of orders daily.
- Design resilient Kafka event-driven architectures with idempotent event processing.
- Collaborate with cloud teams to optimize AWS infrastructure costs and auto-scaling policies.

### Requirements
- 3+ years of professional software engineering experience.
- Strong mastery of Go or Java, microservice architecture, and relational databases.
- Hands-on experience with Kafka, Redis, Docker, and AWS.

### Benefits
- "Future of Work" policy with flexible remote working options across India.
- Industry-standard health insurance and wellness leave.`,
        applyUrl: "https://careers.swiggy.com/",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 20),
        skillsRaw: [
          "Java",
          "Go",
          "Kafka",
          "PostgreSQL",
          "Redis",
          "AWS",
          "Docker",
          "Microservices",
        ],
      },
      {
        externalId: "phonepe-senior-infra-05",
        source: "COMPANY",
        title: "Senior Software Engineer - High Frequency Transactions",
        companyName: "PhonePe",
        companyWebsite: "https://phonepe.com",
        companyLogo: "https://phonepe.com/favicon.ico",
        location: "Bangalore, India",
        workMode: "HYBRID",
        employmentType: "FULL_TIME",
        experienceMinYears: 3,
        experienceMaxYears: 6,
        salaryMin: 3200000,
        salaryMax: 4800000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About PhonePe
PhonePe processes over 7 billion monthly financial transactions with bank-grade security and sub-second latency.

### Key Responsibilities
- Architect and scale low-latency backend systems handling 50,000+ TPS during peak festive traffic.
- Implement strict transaction isolation, distributed locking, and event-driven architectures using Kafka and Aerospike.
- Mentor junior engineers and participate in architecture review boards.

### Requirements
- 3+ years of backend engineering experience building high-scale distributed systems.
- Deep expertise in Java/Kotlin, Spring Boot, and relational/NoSQL databases.
- Mastery of concurrency, JVM profiling, memory management, and network protocols.

### What PhonePe Offers
- Annual CTC: ₹32,00,000 - ₹48,00,000 + substantial ESOPs.
- World-class health insurance covering family and parents.`,
        applyUrl: "https://phonepe.com/careers/",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 22),
        skillsRaw: [
          "Java",
          "Spring Boot",
          "Kafka",
          "PostgreSQL",
          "Distributed Systems",
          "Redis",
          "Docker",
        ],
      },
      {
        externalId: "urbancompany-lead-fullstack-06",
        source: "COMPANY",
        title: "Lead Full Stack Engineer - Partner Marketplace",
        companyName: "Urban Company",
        companyWebsite: "https://www.urbancompany.com",
        companyLogo: "https://www.urbancompany.com/favicon.ico",
        location: "Gurgaon, India",
        workMode: "HYBRID",
        employmentType: "FULL_TIME",
        experienceMinYears: 4,
        experienceMaxYears: 7,
        salaryMin: 3200000,
        salaryMax: 4800000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About Urban Company
Urban Company is Asia's largest home services marketplace, delivering beauty, wellness, cleaning, and appliance repair to over 10 million households.

### Responsibilities
- Architect end-to-end features for service partner onboarding, automated training, and daily earnings disbursement.
- Build high-performance web dashboards in Next.js/React and robust Node.js backend microservices.
- Ensure strict UI accessibility, cross-browser compatibility, and fast page load times.

### Requirements
- 4+ years of full stack software engineering experience.
- Deep knowledge of React, Next.js, TypeScript, Node.js, and PostgreSQL.
- Experience managing sprint deliverables and mentoring junior developers.

### Compensation
- CTC: ₹32,00,000 - ₹48,00,000.
- Health insurance, flexible leaves, and wellness benefits at Gurgaon office.`,
        applyUrl: "https://www.urbancompany.com/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 26),
        skillsRaw: [
          "React",
          "Next.js",
          "Node.js",
          "TypeScript",
          "PostgreSQL",
          "Redis",
          "Docker",
        ],
      },
      {
        externalId: "ather-senior-iot-07",
        source: "COMPANY",
        title: "Senior Embedded & Cloud Software Engineer - EV Telemetry",
        companyName: "Ather Energy",
        companyWebsite: "https://www.atherenergy.com",
        companyLogo: "https://www.atherenergy.com/favicon.ico",
        location: "Bangalore, India",
        workMode: "ONSITE",
        employmentType: "FULL_TIME",
        experienceMinYears: 3,
        experienceMaxYears: 6,
        salaryMin: 2400000,
        salaryMax: 3600000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About Ather Energy
Ather Energy is India's pioneer intelligent electric scooter manufacturer, designing smart connected EVs and nationwide fast-charging grids.

### Responsibilities
- Design real-time telemetry ingestion pipelines processing battery health, GPS coordinates, and motor diagnostics.
- Write high-concurrency Go and Python services backed by MQTT brokers, Kafka, and TimescaleDB.
- Collaborate with embedded hardware engineers on OTA firmware updates and edge diagnostics.

### Requirements
- 3+ years of software engineering experience in cloud, IoT, or telematics domains.
- Strong proficiency in Go, Python, or C++.
- Experience with time-series databases, MQTT/WebSockets, and AWS IoT services.

### Compensation
- Annual CTC: ₹24,00,000 - ₹36,00,000 + equity.
- Health insurance, scooter employee purchase discount, and Bangalore campus perks.`,
        applyUrl: "https://www.atherenergy.com/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 28),
        skillsRaw: [
          "Go",
          "Python",
          "Kafka",
          "PostgreSQL",
          "AWS",
          "Docker",
          "Git",
        ],
      },
      {
        externalId: "yellowai-senior-ai-08",
        source: "COMPANY",
        title: "Senior AI Engineer - Conversational Voice Agents & LLMs",
        companyName: "Yellow.ai",
        companyWebsite: "https://yellow.ai",
        companyLogo: "https://yellow.ai/favicon.ico",
        location: "Bangalore, India",
        workMode: "HYBRID",
        employmentType: "FULL_TIME",
        experienceMinYears: 3,
        experienceMaxYears: 6,
        salaryMin: 2800000,
        salaryMax: 4200000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About Yellow.ai
Yellow.ai is an enterprise generative AI customer service automation platform orchestrating billions of conversations annually in 135+ languages.

### Responsibilities
- Architect low-latency voice AI agents integrating ASR (speech-to-text), LLM reasoning, and TTS (text-to-speech).
- Fine-tune open-source models (Llama, Mistral) and build RAG pipelines with vector databases (Pinecone, Qdrant).
- Deploy scalable inference endpoints on Kubernetes with GPU acceleration.

### Requirements
- 3+ years of AI/ML or backend software engineering experience.
- Deep expertise in Python, LangChain, LlamaIndex, and transformer architectures.
- Experience with real-time streaming protocols (WebSockets, WebRTC, gRPC).

### Compensation
- CTC: ₹28,00,000 - ₹42,00,000 + stock options.
- Hybrid working environment and comprehensive medical insurance.`,
        applyUrl: "https://yellow.ai/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        skillsRaw: [
          "Python",
          "Machine Learning",
          "LLM",
          "Docker",
          "Kubernetes",
          "WebSockets",
          "FastAPI",
        ],
      },
      {
        externalId: "postman-senior-architect-09",
        source: "COMPANY",
        title: "Senior Full Stack Engineer - API Workspace & Observability",
        companyName: "Postman",
        companyWebsite: "https://postman.com",
        companyLogo: "https://postman.com/favicon.ico",
        location: "Bangalore, India",
        workMode: "REMOTE",
        employmentType: "FULL_TIME",
        experienceMinYears: 4,
        experienceMaxYears: 7,
        salaryMin: 3200000,
        salaryMax: 4800000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About Postman
Postman is the world's leading API platform used by more than 30 million developers and 500,000 organizations worldwide to design, test, document, and collaborate on APIs.

### Responsibilities
- Develop interactive, real-time collaboration tools in the Postman web and desktop applications using React, TypeScript, and Node.js.
- Build resilient backend microservices handling high-frequency API telemetry, mock servers, and automated collection monitors.
- Collaborate with open-source communities and integrate OpenAPI, GraphQL, and gRPC specification standards.

### Qualifications
- 4+ years of professional full-stack web development experience.
- Strong expertise with TypeScript, React, Node.js, and modern CSS/styled systems.
- Experience with real-time architectures (WebSockets, Server-Sent Events, WebRTC).

### Perks
- 100% remote work environment with global offsite retreats.
- Ergonomic workspace setup budget + monthly high-speed internet stipend.
- Comprehensive medical insurance with mental healthcare support.`,
        applyUrl: "https://www.postman.com/company/careers/open-positions/",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 18),
        skillsRaw: [
          "TypeScript",
          "React",
          "Node.js",
          "GraphQL",
          "REST",
          "WebSockets",
          "Docker",
          "AWS",
        ],
      },
      {
        externalId: "browserstack-senior-devops-10",
        source: "COMPANY",
        title: "Senior Cloud & DevOps Infrastructure Architect",
        companyName: "BrowserStack",
        companyWebsite: "https://browserstack.com",
        companyLogo: "https://browserstack.com/favicon.ico",
        location: "Mumbai, India",
        workMode: "HYBRID",
        employmentType: "FULL_TIME",
        experienceMinYears: 4,
        experienceMaxYears: 8,
        salaryMin: 3200000,
        salaryMax: 4800000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About BrowserStack
BrowserStack is the global leader in software testing, powering more than 2 million tests every day across 15 global data centers.

### Responsibilities
- Manage and scale thousands of bare-metal and cloud Kubernetes clusters hosting mobile devices and desktop browser VMs.
- Automate zero-downtime infrastructure provisioning using Terraform, Ansible, and Helm.
- Build real-time telemetry, Prometheus alerting, and Grafana observability pipelines for sub-second incident detection.

### Requirements
- 4+ years of DevOps / Site Reliability Engineering (SRE) experience managing production infrastructure at scale.
- Deep expertise in Kubernetes, Linux internals, networking (TCP/IP, BGP, DNS), and container runtimes.
- Proficiency in scripting with Python, Bash, or Go.

### Benefits
- Lucrative compensation package with performance bonus and stock incentives.
- Comprehensive health insurance covering self, spouse, children, and dependent parents.
- Hybrid working options with state-of-the-art office spaces in Mumbai.`,
        applyUrl: "https://www.browserstack.com/careers",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 16),
        skillsRaw: [
          "Kubernetes",
          "Docker",
          "Terraform",
          "Linux",
          "Python",
          "Go",
          "AWS",
          "CI/CD",
        ],
      },
    ];

    if (!params) {
      return rawJobs;
    }

    let filtered = rawJobs;
    if (params.query) {
      const q = params.query.toLowerCase().trim();
      const isIntern = /\bintern(ship)?\b/i.test(q);
      filtered = filtered.filter((j) => {
        if (isIntern) {
          return (
            j.employmentType === "INTERNSHIP" ||
            j.title.toLowerCase().includes("intern")
          );
        }
        return (
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          (j.skillsRaw && j.skillsRaw.some((s) => s.toLowerCase().includes(q)))
        );
      });
    }

    if (params.location) {
      const loc = params.location.toLowerCase();
      filtered = filtered.filter((j) =>
        (j.location || "").toLowerCase().includes(loc),
      );
    }

    return filtered;
  }
}
