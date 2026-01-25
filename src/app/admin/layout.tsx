import { AdminSidebar } from "@/components/admin-sidebar"
import { cookies } from "next/headers"
import { verifySession } from "@/lib/session"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('session')?.value
    const session = sessionToken ? await verifySession(sessionToken) : null
    const role = session?.role

    return (
        <div className="min-h-screen bg-slate-50/50">
            <AdminSidebar role={role} />
            <main className="ml-72 p-8 transition-all duration-300 ease-in-out">
                <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {children}
                </div>
            </main>
        </div>
    )
}
