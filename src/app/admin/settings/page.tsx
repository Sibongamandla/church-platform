import Link from "next/link";
import { Users, Shield, Bell, Lock, Globe } from "lucide-react";

const settingGroups = [
    {
        title: "Access Control",
        items: [
            {
                label: "Team & Users",
                description: "Manage evangelists, admins and their roles.",
                icon: Users,
                href: "/admin/settings/users",
                color: "text-blue-600",
                bg: "bg-blue-50"
            },
            {
                label: "Security",
                description: "Configure two-factor and login policies.",
                icon: Shield,
                href: "#",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                disabled: true
            }
        ]
    },
    {
        title: "Communication",
        items: [
            {
                label: "Notifications",
                description: "Email and push message settings.",
                icon: Bell,
                href: "#",
                color: "text-amber-600",
                bg: "bg-amber-50",
                disabled: true
            }
        ]
    }
];

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-1">Configure your platform and manage your team.</p>
            </div>

            <div className="grid gap-8">
                {settingGroups.map((group) => (
                    <div key={group.title} className="space-y-4">
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            {group.title}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {group.items.map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.disabled ? "#" : item.href}
                                    className={`group p-6 bg-card border rounded-xl shadow-sm transition-all ${
                                        item.disabled 
                                            ? "opacity-60 cursor-not-allowed" 
                                            : "hover:border-primary/50 hover:shadow-md"
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-lg ${item.bg} ${item.color} transition-colors`}>
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                                                {item.label}
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                                {item.description}
                                            </p>
                                            {item.disabled && (
                                                <span className="inline-block mt-2 text-[10px] font-bold bg-muted px-2 py-0.5 rounded uppercase tracking-tighter">
                                                    Coming Soon
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
