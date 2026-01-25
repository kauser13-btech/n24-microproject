import { getCenters, getCandidates } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MapPin, Users, Vote } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
    const centers = await getCenters()
    const candidates = await getCandidates()

    const stats = [
        {
            title: "Total Centers",
            value: centers.length,
            description: "Registered polling stations",
            icon: MapPin,
            color: "text-indigo-600 bg-indigo-50",
        },
        {
            title: "Total Candidates",
            value: candidates.length,
            description: "Across all districts",
            icon: Users,
            color: "text-blue-600 bg-blue-50",
        },
        {
            title: "Total Parties",
            value: new Set(candidates.map(c => c.party)).size,
            description: "Active political parties",
            icon: Vote,
            color: "text-green-600 bg-green-50",
        },
    ]

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Overview of election data and system status.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.title} className="border-0 shadow-lg shadow-slate-200/40 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden group">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-50/50 border-b border-slate-50">
                            <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10 shadow-sm opacity-80 group-hover:opacity-100 transition-opacity`}>
                                <stat.icon className={`h-5 w-5 ${stat.color.replace('bg-', 'text-').split(' ')[0]}`} />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                            <p className="text-xs font-medium text-slate-400 mt-2">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Placeholder for future widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ... */}
            </div>
        </div>
    )
}
