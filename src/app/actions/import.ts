"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { Member } from "@prisma/client";

type ImportResult = {
    success: number;
    errors: string[];
};

export async function bulkImportMembersAction(data: any[]): Promise<ImportResult> {
    await requireRole("REGISTRY_CLERK");

    let successCount = 0;
    const errors: string[] = [];

    for (const row of data) {
        // Expected structure: firstName, lastName, email, phone, address, birthday, gender, status
        // We'll trust the client side parser laid it out correctly, but validate here too.

        // Basic validation
        if (!row.firstName || !row.lastName) {
            errors.push(`Skipped row: Missing name for record ${JSON.stringify(row)}`);
            continue;
        }

        try {
            await prisma.member.create({
                data: {
                    firstName: row.firstName,
                    lastName: row.lastName,
                    email: row.email || null,
                    phone: row.phone || null,
                    address: row.address || null,
                    birthday: row.birthday ? new Date(row.birthday) : null,
                    gender: row.gender || null,
                    status: row.status || "ACTIVE",
                }
            });
            successCount++;
        } catch (e: any) {
            if (e.code === 'P2002') { // Unique constraint violation (likely email)
                errors.push(`Skipped: Duplicate email for ${row.firstName} ${row.lastName} (${row.email})`);
            } else {
                errors.push(`Failed to import ${row.firstName} ${row.lastName}: ${e.message}`);
            }
        }
    }

    revalidatePath("/admin/members");
    return { success: successCount, errors };
}
