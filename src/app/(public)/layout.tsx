import { PublicHeader } from "@/components/public-header"

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <PublicHeader />
            <main className="flex-1">
                {children}
            </main>
            <footer className="border-t bg-white py-6">
                <div className="container mx-auto px-4 text-center text-sm text-slate-500">
                    স্বত্ব © ২০২৬ News24bd.tv
                </div>
            </footer>
        </div>
    )
}