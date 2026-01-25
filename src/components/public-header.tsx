import Link from "next/link"
import { Vote } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PublicHeader() {
    return (
        <header className="border-b bg-white">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
                    <Vote className="h-6 w-6" />
                    <span>ElectionPortal</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium hover:text-indigo-600 transition-colors">
                        Find Center
                    </Link>
                    <Link href="/about" className="text-sm font-medium hover:text-indigo-600 transition-colors">
                        Voter Info
                    </Link>
                    <Link href="/admin" className="text-sm font-medium hover:text-indigo-600 transition-colors">
                        Admin Login
                    </Link>
                </nav>
                <div className="flex md:hidden">
                    {/* Mobile Menu Trigger would go here */}
                </div>
            </div>
        </header>
    )
}
