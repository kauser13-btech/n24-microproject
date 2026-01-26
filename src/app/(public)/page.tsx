import { getCenters } from "@/lib/db"
import { CenterSearchGrid } from "@/components/center-search-grid"

export const dynamic = 'force-dynamic' // Ensure we always get fresh data since we're using file system mock DB

export default async function HomePage() {
    const centers = await getCenters()

    return (
        <div className="container mx-auto px-4 py-12 space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 pb-2">
                    আসন সিলেক্ট করুন ও প্রতিনিধির সম্পর্কে বিস্তারিত জানুন
                </h1>
            </div>
            <CenterSearchGrid initialCenters={centers} />
        </div>
    )
}
