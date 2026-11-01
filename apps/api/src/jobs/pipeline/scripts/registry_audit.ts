import * as dotenv from "dotenv";
dotenv.config();

import { PrismaService } from "../../../prisma/prisma.service";

async function main() {
  const prisma = new PrismaService();

  const total = await prisma.company.count();
  const verified = await prisma.company.count({ where: { verified: true } });

  const byType = await prisma.company.groupBy({
    by: ["companyType"],
    _count: { _all: true },
  });

  const byAts = await prisma.company.groupBy({
    by: ["atsType"],
    _count: { _all: true },
  });

  const verifiedComps = await prisma.company.findMany({
    where: { verified: true },
    select: { name: true, companyType: true, atsType: true, atsSlug: true },
  });

  console.log("=== REGISTRY SUMMARY ===");
  console.log(`Total Companies: ${total}`);
  console.log(`Verified Companies: ${verified}`);

  console.log("\nBy Company Type:");
  console.table(
    byType.map((t) => ({ Type: t.companyType, Count: t._count._all })),
  );

  console.log("\nBy ATS Type:");
  console.table(byAts.map((a) => ({ ATS: a.atsType, Count: a._count._all })));

  console.log("\nVerified Companies List:");
  console.table(verifiedComps);

  await prisma.$disconnect();
}

main().catch(console.error);
