"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const sessionSchema = z.object({
    name: z.string().min(1, "Session name is required"),
    date: z.string().min(1, "Date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
});

export type ManualSessionState = {
    success?: boolean;
    message?: string;
    errors?: {
        name?: string[];
        date?: string[];
        startTime?: string[];
        endTime?: string[];
    };
};

export async function createManualSessionAction(prevState: ManualSessionState, formData: FormData): Promise<ManualSessionState> {
    const data = Object.fromEntries(formData.entries());
    const parsed = sessionSchema.safeParse(data);

    if (!parsed.success) {
        return { success: false, errors: parsed.error.flatten().fieldErrors };
    }

    const { name, date, startTime, endTime } = parsed.data;

    // Combine date and time
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);

    try {
        await prisma.serviceSession.create({
            data: {
                name,
                date: new Date(date),
                startTime: start,
                endTime: end,
                type: "MANUAL",
                headcount: 0,
                schedule: {
                    create: {}
                }
            }
        });

        revalidatePath("/admin/attendance");
    } catch (error) {
        console.error("Manual session creation error:", error);
        return { success: false, message: "Failed to create session. A session with this name and date may already exist." };
    }

    redirect("/admin/attendance");
}
