"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { generateSecureToken } from "@/lib/security";
import { logAuditEvent } from "@/lib/audit";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

import { ExportFormat, MemberExportField, MEMBER_EXPORT_FIELDS } from "@/lib/export-types";

interface ExportRequest {
    format: ExportFormat;
    fields: MemberExportField[];
    statusFilter?: string;
}

export async function requestDataExportAction(request: ExportRequest) {
    const user = await requireRole("SUPER_ADMIN");

    // Rate limiting — 3 exports per hour
    const rateCheck = checkRateLimit(`export:${user.id}`, RATE_LIMITS.DATA_EXPORT);
    if (!rateCheck.success) {
        return {
            error: "Export rate limit exceeded. You can request up to 3 exports per hour. Please try again later.",
        };
    }

    // Validate fields
    const validFields = MEMBER_EXPORT_FIELDS.map((f) => f.key);
    const selectedFields = request.fields.filter((f) => validFields.includes(f));
    if (selectedFields.length === 0) {
        return { error: "Please select at least one field to export." };
    }

    // Generate a secure, time-limited download token
    const token = generateSecureToken(48);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    try {
        await prisma.dataExport.create({
            data: {
                userId: user.id,
                token,
                format: request.format,
                scope: "members",
                fields: JSON.stringify(selectedFields),
                filters: request.statusFilter
                    ? JSON.stringify({ status: request.statusFilter })
                    : null,
                status: "PENDING",
                expiresAt,
            },
        });

        // Log the export request
        await logAuditEvent({
            userId: user.id,
            action: "DATA_EXPORT_REQUEST",
            resource: "exports",
            details: {
                format: request.format,
                scope: "members",
                fieldCount: selectedFields.length,
                sensitiveFields: selectedFields.filter((f) =>
                    MEMBER_EXPORT_FIELDS.find((mf) => mf.key === f)?.sensitive
                ),
                statusFilter: request.statusFilter || "all",
            },
        });

        return {
            success: true,
            token,
            expiresAt: expiresAt.toISOString(),
        };
    } catch (error) {
        console.error("Export request failed:", error);
        return { error: "Failed to create export request. Please try again." };
    }
}

export async function getExportHistoryAction() {
    const user = await requireRole("SUPER_ADMIN");

    try {
        const exports = await prisma.dataExport.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: 20,
            select: {
                id: true,
                format: true,
                scope: true,
                fields: true,
                filters: true,
                status: true,
                expiresAt: true,
                downloadedAt: true,
                createdAt: true,
            },
        });

        // Mark expired exports
        const now = new Date();
        return exports.map((exp) => ({
            ...exp,
            status: exp.status === "PENDING" && exp.expiresAt < now ? "EXPIRED" : exp.status,
        }));
    } catch (error) {
        console.error("Failed to fetch export history:", error);
        return [];
    }
}

export async function getRecentAuditLogsAction() {
    const user = await requireRole("SUPER_ADMIN");

    try {
        const logs = await prisma.auditLog.findMany({
            orderBy: { createdAt: "desc" },
            take: 50,
            select: {
                id: true,
                userId: true,
                action: true,
                resource: true,
                details: true,
                ipAddress: true,
                createdAt: true,
            },
        });

        return logs;
    } catch (error) {
        console.error("Failed to fetch audit logs:", error);
        return [];
    }
}
