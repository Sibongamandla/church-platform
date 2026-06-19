import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
    const seedPassword = process.env.ADMIN_SEED_PASSWORD || crypto.randomUUID().slice(0, 16);
    if (!process.env.ADMIN_SEED_PASSWORD) {
        console.log('\n⚠️  Generated random admin password:', seedPassword);
        console.log('   Save this password! It will not be shown again.\n');
    }
    const adminPassword = await bcrypt.hash(seedPassword, 12);

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
