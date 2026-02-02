import { getCenters } from "@/lib/db"
import { CenterSearchGrid } from "@/components/center-search-grid"
import { CountDown } from "@/components/ui/count-down"
import ElectionDashboard from "@/components/election-dashboard"

export const dynamic = 'force-dynamic' // Ensure we always get fresh data since we're using file system mock DB

export default async function HomePage() {
    const centers = await getCenters()

    return (
        <div className="container mx-auto px-4 py-12 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 pb-2">
                    ত্রয়োদশ জাতীয় সংসদ নির্বাচন
                </h1>
                <p className="text-lg text-slate-600">১২ ফেব্রুয়ারি ২০২৬</p>
            </div>

            <CountDown targetDate="2026-02-12" />
            <ElectionDashboard />
            <CenterSearchGrid initialCenters={centers} />
        </div>
    )
}
