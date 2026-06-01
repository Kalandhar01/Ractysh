import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  await prisma.$queryRaw`SELECT 1`;

  const [
    siteConfigs,
    navItems,
    divisions,
    services,
    projects,
    adminUsers,
    consultations,
    workflowStages
  ] = await Promise.all([
    prisma.siteConfig.count(),
    prisma.navItem.count(),
    prisma.companyDivision.count(),
    prisma.serviceOffer.count(),
    prisma.project.count(),
    prisma.adminUser.count(),
    prisma.consultation.count(),
    prisma.workflowStage.count()
  ]);

  process.stdout.write(
    `${JSON.stringify(
      {
        ok: true,
        connected: true,
        provider: "postgresql",
        counts: {
          siteConfigs,
          navItems,
          divisions,
          services,
          projects,
          adminUsers,
          consultations,
          workflowStages
        }
      },
      null,
      2
    )}\n`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
