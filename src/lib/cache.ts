import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

// Cache tags
export const CACHE_TAGS = {
    events: "events",
    announcements: "announcements",
    sermons: "sermons",
};

// Revalidation times (in seconds)
export const REVALIDATE = {
    SHORT: false as const,  // Immediate / No background refresh
    MEDIUM: false as const, // Immediate / No background refresh
    LONG: 86400,            // 24 hours
};

export const getCachedEvents = unstable_cache(
    async () => {
        return await prisma.event.findMany({
            where: {
                startDate: {
                    gte: new Date(),
                },
            },
            orderBy: {
                startDate: "asc",
            },
            take: 3,
        });
    },
    ["featured-events"],
    {
        revalidate: REVALIDATE.MEDIUM,
        tags: [CACHE_TAGS.events],
    }
);

export const getAllUpcomingEvents = unstable_cache(
    async () => {
        return await prisma.event.findMany({
            where: {
                startDate: {
                    gte: new Date(),
                },
            },
            orderBy: {
                startDate: "asc",
            },
        });
    },
    ["all-upcoming-events"],
    {
        revalidate: REVALIDATE.MEDIUM,
        tags: [CACHE_TAGS.events],
    }
);

export const getCachedAnnouncements = unstable_cache(
    async () => {
        return await prisma.announcement.findMany({
            orderBy: {
                date: "desc",
            },
            take: 5,
        });
    },
    ["featured-announcements"],
    {
        revalidate: REVALIDATE.SHORT,
        tags: [CACHE_TAGS.announcements],
    }
);
export const getLatestSermon = unstable_cache(
    async () => {
        return await (prisma as any).sermon.findFirst({
            orderBy: {
                date: "desc",
            },
        });
    },
    ["latest-sermon"],
    {
        revalidate: REVALIDATE.MEDIUM,
        tags: [CACHE_TAGS.sermons],
    }
);

export const getPastEvents = unstable_cache(
    async () => {
        return await prisma.event.findMany({
            where: {
                startDate: {
                    lt: new Date(),
                },
            },
            orderBy: {
                startDate: "desc",
            },
        });
    },
    ["past-events"],
    {
        revalidate: REVALIDATE.MEDIUM,
        tags: [CACHE_TAGS.events],
    }
);
export const getFeaturedRecaps = unstable_cache(
    async () => {
        return await prisma.event.findMany({
            where: {
                startDate: {
                    lt: new Date(),
                },
                recapImages: {
                    isEmpty: false,
                },
            },
            orderBy: {
                startDate: "desc",
            },
            take: 3,
        });
    },
    ["featured-recaps"],
    {
        revalidate: REVALIDATE.MEDIUM,
        tags: [CACHE_TAGS.events],
    }
);

export const getAllAnnouncements = unstable_cache(
    async () => {
        return await prisma.announcement.findMany({
            orderBy: {
                date: "desc",
            },
        });
    },
    ["all-announcements"],
    {
        revalidate: REVALIDATE.SHORT,
        tags: [CACHE_TAGS.announcements],
    }
);

export const getAnnouncementById = unstable_cache(
    async (id: string) => {
        return await prisma.announcement.findUnique({
            where: { id },
        });
    },
    ["announcement-detail"],
    {
        revalidate: REVALIDATE.SHORT,
        tags: [CACHE_TAGS.announcements],
    }
);
