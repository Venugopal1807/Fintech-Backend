import { PrismaClient, Role, UserStatus, RecordType } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;
const DEFAULT_PASSWORD = "Test@1234";

interface SeedUser {
  email: string;
  role: Role;
}

const SEED_USERS: SeedUser[] = [
  { email: "admin@zorvyn.io", role: Role.ADMIN },
  { email: "analyst@zorvyn.io", role: Role.ANALYST },
  { email: "viewer@zorvyn.io", role: Role.VIEWER },
];

async function main(): Promise<void> {
  console.log("🌱 Seeding database...\n");

  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  // Upsert seed users
  const users = await Promise.all(
    SEED_USERS.map((u) =>
      prisma.user.upsert({
        where: { email: u.email },
        update: { role: u.role, status: UserStatus.ACTIVE },
        create: {
          email: u.email,
          passwordHash,
          role: u.role,
          status: UserStatus.ACTIVE,
        },
      })
    )
  );

  const admin = users.find((u) => u.role === Role.ADMIN)!;
  console.log(`✔ Users upserted: ${users.map((u) => u.email).join(", ")}`);

  // Seed financial records tied to the admin user
  const records = [
    {
      amount: 125000.0,
      type: RecordType.INCOME,
      category: "Salary",
      date: new Date("2026-01-15"),
      notes: "January payroll deposit",
    },
    {
      amount: 4500.5,
      type: RecordType.EXPENSE,
      category: "Infrastructure",
      date: new Date("2026-01-20"),
      notes: "AWS monthly billing cycle",
    },
    {
      amount: 32000.0,
      type: RecordType.INCOME,
      category: "Consulting",
      date: new Date("2026-02-01"),
      notes: "Q1 consulting retainer",
    },
    {
      amount: 8750.25,
      type: RecordType.EXPENSE,
      category: "Payroll Tax",
      date: new Date("2026-02-10"),
      notes: "Federal payroll tax remittance",
    },
    {
      amount: 2100.0,
      type: RecordType.EXPENSE,
      category: "Software Licenses",
      date: new Date("2026-03-05"),
      notes: "Annual license renewals",
    },
    {
      amount: 95000.0,
      type: RecordType.INCOME,
      category: "Revenue",
      date: new Date("2026-03-15"),
      notes: "Platform subscription revenue",
    },
  ];

  let created = 0;
  for (const record of records) {
    const existing = await prisma.financialRecord.findFirst({
      where: {
        createdById: admin.id,
        amount: record.amount,
        date: record.date,
        category: record.category,
      },
    });

    if (!existing) {
      await prisma.financialRecord.create({
        data: { ...record, createdById: admin.id },
      });
      created++;
    }
  }

  console.log(`✔ Financial records: ${created} created, ${records.length - created} already existed`);
  console.log("\n✅ Seed completed.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
