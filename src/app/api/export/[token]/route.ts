import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import type { MemberExportField } from "@/lib/export-types";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    const { token } = await params;

    // 1. Validate session — user must be authenticated
    const session = await getSession();
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user;
    if (user.role !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Find and validate the export token
    const exportRecord = await prisma.dataExport.findUnique({
        where: { token },
    });

    if (!exportRecord) {
        return NextResponse.json({ error: "Invalid export token" }, { status: 404 });
    }

    if (exportRecord.userId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (exportRecord.status === "DOWNLOADED") {
        return NextResponse.json(
            { error: "This export has already been downloaded. Please request a new export." },
            { status: 410 }
        );
    }

    if (exportRecord.status === "EXPIRED" || exportRecord.expiresAt < new Date()) {
        // Mark as expired if not already
        await prisma.dataExport.update({
            where: { id: exportRecord.id },
            data: { status: "EXPIRED" },
        });
        return NextResponse.json(
            { error: "This export link has expired. Please request a new export." },
            { status: 410 }
        );
    }

    // 3. Fetch member data based on export configuration
    const fields: MemberExportField[] = JSON.parse(exportRecord.fields);
    const filters = exportRecord.filters ? JSON.parse(exportRecord.filters) : {};

    const whereClause: Record<string, unknown> = {};
    if (filters.status) {
        whereClause.status = filters.status;
    }

    const members = await prisma.member.findMany({
        where: whereClause,
        orderBy: { lastName: "asc" },
        include: {
            family: fields.includes("familyName") ? { select: { name: true } } : false,
            _count: fields.includes("attendanceCount")
                ? { select: { attendance: true } }
                : false,
        },
    });

    // 4. Build export data with only selected fields
    const exportData = members.map((member) => {
        const row: Record<string, string | number | null> = {};

        if (fields.includes("firstName")) row.firstName = member.firstName;
        if (fields.includes("lastName")) row.lastName = member.lastName;
        if (fields.includes("email")) row.email = member.email;
        if (fields.includes("phone")) row.phone = member.phone;
        if (fields.includes("address")) row.address = member.address;
        if (fields.includes("birthday"))
            row.birthday = member.birthday
                ? member.birthday.toISOString().split("T")[0]
                : null;
        if (fields.includes("gender")) row.gender = member.gender;
        if (fields.includes("status")) row.status = member.status;
        if (fields.includes("familyName"))
            row.familyName = (member as any).family?.name || null;
        if (fields.includes("createdAt"))
            row.createdAt = member.createdAt.toISOString().split("T")[0];
        if (fields.includes("attendanceCount"))
            row.attendanceCount = (member as any)._count?.attendance || 0;

        return row;
    });

    // 5. Generate file content
    let fileContent: string;
    let contentType: string;
    let fileExtension: string;

    if (exportRecord.format === "csv") {
        // Build CSV
        const headers = fields.map((f) => f);
        const csvRows = [headers.join(",")];

        for (const row of exportData) {
            const values = headers.map((h) => {
                const val = row[h];
                if (val === null || val === undefined) return "";
                const str = String(val);
                // Escape CSV values that contain commas, quotes, or newlines
                if (str.includes(",") || str.includes('"') || str.includes("\n")) {
                    return `"${str.replace(/"/g, '""')}"`;
                }
                return str;
            });
            csvRows.push(values.join(","));
        }

        fileContent = csvRows.join("\n");
        contentType = "text/csv; charset=utf-8";
        fileExtension = "csv";
    } else {
        // JSON
        fileContent = JSON.stringify(exportData, null, 2);
        contentType = "application/json; charset=utf-8";
        fileExtension = "json";
    }

    // 6. Mark as downloaded (one-time use)
    await prisma.dataExport.update({
        where: { id: exportRecord.id },
        data: {
            status: "DOWNLOADED",
            downloadedAt: new Date(),
        },
    });

    // 7. Audit log the download
    await logAuditEvent({
        userId: user.id,
        action: "DATA_EXPORT_DOWNLOAD",
        resource: "exports",
        details: {
            exportId: exportRecord.id,
            format: exportRecord.format,
            recordCount: exportData.length,
            fields,
        },
    });

    // 8. Return file as download
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const filename = `member-export-${timestamp}.${fileExtension}`;

    return new NextResponse(fileContent, {
        status: 200,
        headers: {
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Cache-Control": "no-store, no-cache, must-revalidate",
            "Pragma": "no-cache",
            "X-Content-Type-Options": "nosniff",
        },
    });
}
