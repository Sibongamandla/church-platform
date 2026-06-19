export type ExportScope = "members";
export type ExportFormat = "csv" | "json";

export type MemberExportField =
    | "firstName"
    | "lastName"
    | "email"
    | "phone"
    | "address"
    | "birthday"
    | "gender"
    | "status"
    | "familyName"
    | "createdAt"
    | "attendanceCount";

export const MEMBER_EXPORT_FIELDS: { key: MemberExportField; label: string; sensitive: boolean }[] = [
    { key: "firstName", label: "First Name", sensitive: false },
    { key: "lastName", label: "Last Name", sensitive: false },
    { key: "email", label: "Email Address", sensitive: true },
    { key: "phone", label: "Phone Number", sensitive: true },
    { key: "address", label: "Physical Address", sensitive: true },
    { key: "birthday", label: "Date of Birth", sensitive: true },
    { key: "gender", label: "Gender", sensitive: false },
    { key: "status", label: "Membership Status", sensitive: false },
    { key: "familyName", label: "Family Group", sensitive: false },
    { key: "createdAt", label: "Date Joined", sensitive: false },
    { key: "attendanceCount", label: "Total Attendance", sensitive: false },
];
