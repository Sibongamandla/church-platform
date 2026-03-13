export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Stats Cards - Placeholders */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Total Members</h3>
                    </div>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground">+20 from last month</p>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Identify Attendance</h3>
                    </div>
                    <div className="text-2xl font-bold">85%</div>
                    <p className="text-xs text-muted-foreground">Last Sunday</p>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Giving (MTD)</h3>
                    </div>
                    <div className="text-2xl font-bold">$45,231</div>
                    <p className="text-xs text-muted-foreground">+12% from last month</p>
                </div>
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium">Active Events</h3>
                    </div>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">Coming up this week</p>
                </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="p-6 flex flex-row items-center justify-between">
                    <h3 className="tracking-tight text-lg font-medium">Recent Activity</h3>
                </div>
                <div className="p-6 pt-0">
                    <p className="text-sm text-muted-foreground">No recent activity to display.</p>
                </div>
            </div>
        </div>
    );
}
