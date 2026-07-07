"use client";

interface BreakdownItem {
    label: string;
    score: number;
    max: number;
    note: string;
}

interface Props {
    score: number;
    breakdown: BreakdownItem[];
}

function ScoreRing({ score }: { score: number }) {
    const r = 54;
    const circumference = 2 * Math.PI * r;
    const offset = circumference * (1 - score / 100);
    const color = score >= 75 ? "#16a34a" : score >= 45 ? "#f59e0b" : "#dc2626";
    const label = score >= 75 ? "Healthy" : score >= 45 ? "Improving" : "Needs Attention";

    return (
        <div className="flex flex-col items-center gap-2">
            <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
                <circle
                    cx="70" cy="70" r={r}
                    fill="none"
                    stroke={color}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 70 70)"
                    style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
                <text x="70" y="64" textAnchor="middle" dominantBaseline="middle" fontSize="28" fontWeight="700" fill="currentColor">
                    {score}
                </text>
                <text x="70" y="84" textAnchor="middle" dominantBaseline="middle" fontSize="10" fill={color} fontWeight="600">
                    {label}
                </text>
            </svg>
            <p className="text-xs text-muted-foreground">Platform Health Score</p>
        </div>
    );
}

export function PlatformHealth({ score, breakdown }: Props) {
    return (
        <div className="rounded-xl border bg-card shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-6">Platform Health</h2>
            <div className="flex flex-col sm:flex-row items-center gap-8">
                <ScoreRing score={score} />
                <div className="flex-1 space-y-3 w-full">
                    {breakdown.map((item) => {
                        const pct = Math.round((item.score / item.max) * 100);
                        const barColor = pct === 100 ? "bg-green-500" : pct >= 50 ? "bg-amber-500" : "bg-red-400";
                        return (
                            <div key={item.label}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">{item.label}</span>
                                    <span className="text-xs text-muted-foreground">{item.note}</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full ${barColor} transition-all duration-700`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
