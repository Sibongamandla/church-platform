import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireRole } from "@/lib/auth";
import { UserManagementUI } from "@/components/admin/UserManagementUI";
import { redirect } from "next/navigation";

export default async function UserManagementPage() {
    // Only SUPER_ADMIN can manage users
    const admin = await requireRole("SUPER_ADMIN");
    
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <UserManagementUI 
            users={users.map(u => ({
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                setupRequired: u.setupRequired,
                createdAt: u.createdAt
            }))} 
            currentUserEmail={admin.email}
        />
    );
}
