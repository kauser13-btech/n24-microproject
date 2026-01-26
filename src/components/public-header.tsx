import Link from "next/link"
import { Vote } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PublicHeader() {
    return (
        <header className="border-b bg-white">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
                    <img src="/logo.webp" alt="Logo" className="h-8 w-auto" />
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <a href="https://www.news24bd.tv/" className="text-sm font-medium hover:text-indigo-600 transition-colors">
                        মূল সাইট এ যান
                    </a>
                </nav>
                <div className="flex md:hidden">
                    {/* Mobile Menu Trigger would go here */}
                </div>
            </div>
        </header>
    )
}
