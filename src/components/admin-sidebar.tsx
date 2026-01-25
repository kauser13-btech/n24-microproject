"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, MapPin, Users, LogOut, Settings, Image, UserCog, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { logoutAction } from "@/lib/actions"

interface AdminSidebarProps {
    role?: string
}

export function AdminSidebar({ role }: AdminSidebarProps) {
    const pathname = usePathname()

    const links = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/centers", label: "Centers", icon: MapPin },
        { href: "/admin/candidates", label: "Candidates", icon: Users },
        { href: "/admin/signs", label: "Signs", icon: Image },
        { href: "/admin/profile", label: "Profile", icon: Settings },
    ]

    if (role === 'superadmin') {
        links.push({ href: "/admin/users", label: "User Management", icon: UserCog })
    }

    return (
        <aside className="w-72 bg-slate-900 h-screen flex flex-col fixed left-0 top-0 text-slate-100 shadow-xl z-50 transition-all duration-300">
            <div className="h-20 flex items-center px-8 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-indigo-400">
                    <ShieldCheck className="h-8 w-8" />
                    <span className="font-bold text-2xl tracking-tight text-white">Election<span className="text-indigo-500">Portal</span></span>
                </div>
            </div>

            <div className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
                <div className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Menu
                </div>
                {links.map((link) => {
                    const Icon = link.icon
                    const isActive = pathname === link.href

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-indigo-200" : "text-slate-500 group-hover:text-white")} />
                            <span className="relative z-10">{link.label}</span>
                            {isActive && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-20" />}
                        </Link>
                    )
                })}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
                        {role?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white">Admin User</p>
                        <p className="text-xs text-slate-500 capitalize">{role || "Editor"}</p>
                    </div>
                </div>
                <form action={logoutAction}>
                    <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg text-sm font-medium transition-all duration-200">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </form>
            </div>
        </aside>
    )
}
