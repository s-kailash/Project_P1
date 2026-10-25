import { prisma } from "../src/utils/prisma";

async function main() {
  await prisma.user.upsert({
    where: { email: "demo@opshub.dev" },
    update: {},
    create: {
      email: "demo@opshub.dev",
      name: "Demo User",
      passwordHash: "PLACEHOLDER_REPLACED_IN_GOAL_2",
    },
  });
  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
