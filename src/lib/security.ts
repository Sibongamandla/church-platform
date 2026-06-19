import crypto from "crypto";

/**
 * Generate a cryptographically secure random string.
 * Uses crypto.getRandomValues() for true randomness.
 */
export function generateSecureToken(length: number = 48): string {
    const bytes = crypto.randomBytes(length);
    return bytes.toString("base64url").slice(0, length);
}

/**
 * Generate a cryptographically secure temporary password.
 * Uses alphanumeric characters for easy communication.
 * 12 characters = ~71 bits of entropy (vs 6-digit = ~20 bits).
 */
export function generateSecureTempCode(length: number = 12): string {
    const charset = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    const values = new Uint32Array(length);
    crypto.getRandomValues(values);
    return Array.from(values, (v) => charset[v % charset.length]).join("");
}

/**
 * Sanitize a filename to prevent path traversal attacks.
 * Strips directory components, removes special characters, 
 * preserves only alphanumeric, dash, underscore, and dot.
 */
export function sanitizeFilename(filename: string): string {
    // Remove any path components
    const basename = filename.split(/[/\\]/).pop() || "file";
    // Remove any characters that aren't alphanumeric, dash, underscore, or dot
    const sanitized = basename.replace(/[^a-zA-Z0-9._-]/g, "");
    // Ensure it's not empty and doesn't start with a dot (hidden file)
    return sanitized.replace(/^\.+/, "") || "file";
}

/**
 * Extract file extension safely.
 * Returns lowercase extension without the dot, or null if none.
 */
export function getFileExtension(filename: string): string | null {
    const sanitized = sanitizeFilename(filename);
    const lastDot = sanitized.lastIndexOf(".");
    if (lastDot === -1 || lastDot === sanitized.length - 1) return null;
    return sanitized.slice(lastDot + 1).toLowerCase();
}

/**
 * Validate image file by checking magic bytes (file signature).
 * More reliable than checking file.type which is client-reported.
 */
export async function validateImageMagicBytes(buffer: Buffer): Promise<boolean> {
    if (buffer.length < 4) return false;

    // JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
        return true;
    }

    // PNG: 89 50 4E 47
    if (
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47
    ) {
        return true;
    }

    // GIF: 47 49 46 38
    if (
        buffer[0] === 0x47 &&
        buffer[1] === 0x49 &&
        buffer[2] === 0x46 &&
        buffer[3] === 0x38
    ) {
        return true;
    }

    // WebP: 52 49 46 46 ... 57 45 42 50
    if (
        buffer.length >= 12 &&
        buffer[0] === 0x52 &&
        buffer[1] === 0x49 &&
        buffer[2] === 0x46 &&
        buffer[3] === 0x46 &&
        buffer[8] === 0x57 &&
        buffer[9] === 0x45 &&
        buffer[10] === 0x42 &&
        buffer[11] === 0x50
    ) {
        return true;
    }

    return false;
}

/**
 * Mask a phone number for privacy — show only last 4 digits.
 * e.g., "+27 82 123 4567" → "•••• 4567"
 */
export function maskPhoneNumber(phone: string): string {
    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 4) return "••••";
    const last4 = digitsOnly.slice(-4);
    return `•••• ${last4}`;
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
export function secureCompare(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// Allowed image MIME types (for reference, but we validate via magic bytes)
export const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
] as const;

// Maximum file sizes
export const MAX_FILE_SIZES = {
    IMAGE: 5 * 1024 * 1024, // 5MB
    UPLOAD: 10 * 1024 * 1024, // 10MB
} as const;
