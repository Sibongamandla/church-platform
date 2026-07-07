"use client";

import {
    Video, Calendar, Megaphone, HeartHandshake, Share2, Image,
    QrCode, CheckCircle, AlertTriangle, AlertCircle, ArrowRight
} from "lucide-react";

const ICONS: Record<string, React.ElementType> = {
    Video, Calendar, Megaphone, HeartHandshake, Share2, Image, QrCode, CheckCircle,
};

export interface Insight {
    priority: "urgent" | "recommended" | "on-track";
    title: string;
    detail: string;
    href: string;
    icon: string;
}

const PRIORITY_STYLES: Record<Insight["priority"], { border: string; badge: string; badgeText: string; icon: React.ElementType }> = {
    urgent: {
        border: "border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900",
        badge: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
        badgeText: "Action Needed",
        icon: AlertCircle,
    },
    recommended: {
        border: "border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900",
        badge: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
        badgeText: "Recommended",
        icon: AlertTriangle,
    },
    "on-track": {
        border: "border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900",
        badge: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
        badgeText: "On Track",
        icon: CheckCircle,
    },
};

export function ActionableInsights({ insights }: { insights: Insight[] }) {
    if (insights.length === 0) return null;

    return (
        <div className="analytics-section">
            <h2 className="text-lg font-semibold mb-4">Actionable Insights</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {insights.map((insight, i) => {
                    const style = PRIORITY_STYLES[insight.priority];
                    const Icon = ICONS[insight.icon] ?? CheckCircle;
                    const PriorityIcon = style.icon;
                    return (
                        <a
                            key={i}
                            href={insight.href}
                            className={`rounded-xl border p-5 flex flex-col gap-3 hover:shadow-md transition-shadow ${style.border}`}
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="h-9 w-9 rounded-lg bg-background/60 flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <Icon className="h-5 w-5 text-foreground" />
                                </div>
                                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${style.badge}`}>
                                    <PriorityIcon className="h-3 w-3" />
                                    {style.badgeText}
                                </span>
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{insight.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">{insight.detail}</p>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium text-primary mt-auto">
                                Go now <ArrowRight className="h-3 w-3" />
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
