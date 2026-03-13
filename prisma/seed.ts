import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const adminPassword = await bcrypt.hash("admin123", 12);

    const admin = await prisma.user.upsert({
        where: { email: "admin@greatnation.org" },
        update: {
            password: adminPassword,
            role: "SUPER_ADMIN",
            name: "System Admin"
        },
        create: {
            email: "admin@greatnation.org",
            password: adminPassword,
            role: "SUPER_ADMIN",
            name: "System Admin"
        }
    });

    console.log("Admin user seeded:", admin.email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
