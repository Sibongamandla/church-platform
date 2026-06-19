"use server";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export type AuditAction =
    | "LOGIN"
    | "LOGIN_FAILED"
    | "LOGOUT"
    | "REGISTER"
    | "PASSWORD_SETUP"
    | "USER_CREATE"
    | "USER_DELETE"
    | "USER_ROLE_CHANGE"
    | "MEMBER_CREATE"
    | "MEMBER_UPDATE"
    | "MEMBER_DELETE"
    | "MEMBER_IMPORT"
    | "MEMBER_CHECK_IN"
    | "VISITOR_REGISTER"
    | "EVENT_CREATE"
    | "EVENT_UPDATE"
    | "EVENT_DELETE"
    | "ANNOUNCEMENT_CREATE"
    | "ANNOUNCEMENT_UPDATE"
    | "ANNOUNCEMENT_DELETE"
    | "SERMON_CREATE"
    | "SERMON_UPDATE"
    | "SERMON_DELETE"
    | "CONTENT_UPDATE"
    | "CONTENT_DELETE"
    | "MEDIA_UPDATE"
    | "PROFILE_CREATE"
    | "PROFILE_UPDATE"
    | "SESSION_CREATE"
    | "SESSION_SYNC"
    | "TEAM_CREATE"
    | "TEAM_MEMBER_ADD"
    | "TEAM_MEMBER_REMOVE"
    | "VOLUNTEER_SCHEDULE"
    | "VOLUNTEER_STATUS_CHANGE"
    | "VOLUNTEER_JOIN"
    | "DATA_EXPORT_REQUEST"
    | "DATA_EXPORT_DOWNLOAD"
    | "FILE_UPLOAD"
    | "LINK_CREATE"
    | "LINK_DELETE"
    | "CRON_ARCHIVE";

export type AuditResource =
    | "auth"
    | "user"
    | "members"
    | "attendance"
    | "events"
    | "announcements"
    | "sermons"
    | "content"
    | "media"
    | "profiles"
    | "sessions"
    | "teams"
    | "volunteers"
    | "exports"
    | "uploads"
    | "links"
    | "cron";

interface AuditLogParams {
    userId?: string | null;
    action: AuditAction;
    resource: AuditResource;
    details?: Record<string, unknown>;
}

/**
 * Logs an audit event to the database.
 * Captures IP address and user agent from request headers.
 * Non-blocking — errors are caught and logged, never thrown.
 */
export async function logAuditEvent({
    userId,
    action,
    resource,
    details,
}: AuditLogParams): Promise<void> {
    try {
        const headersList = await headers();
        const ipAddress =
            headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            headersList.get("x-real-ip") ||
            "unknown";
        const userAgent = headersList.get("user-agent") || "unknown";

        await prisma.auditLog.create({
            data: {
                userId: userId || null,
                action,
                resource,
                details: details ? JSON.stringify(details) : null,
                ipAddress,
                userAgent,
            },
        });
    } catch (error) {
        // Audit logging should never break the main operation
        console.error("[AUDIT] Failed to log event:", error);
    }
}

/**
 * Cleans up audit logs older than the retention period (default: 90 days).
 */
export async function cleanupAuditLogs(retentionDays: number = 90): Promise<number> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - retentionDays);

    const result = await prisma.auditLog.deleteMany({
        where: {
            createdAt: { lt: cutoff },
        },
    });

    return result.count;
}
