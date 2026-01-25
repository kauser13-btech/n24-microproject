"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
    totalItems: number
    itemsPerPage: number
    currentPage?: number
}

export function Pagination({ totalItems, itemsPerPage, currentPage = 1 }: PaginationProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const totalPages = Math.ceil(totalItems / itemsPerPage)

    // No need to render pagination if there's only 1 page
    if (totalPages <= 1) return null

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', pageNumber.toString())
        return `${pathname}?${params.toString()}`
    }

    const handlePageChange = (page: number) => {
        router.push(createPageURL(page))
    }

    return (
        <div className="flex items-center justify-between px-2">
            <div className="text-sm text-slate-500">
                Showing <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span> to{" "}
                <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{" "}
                <span className="font-medium">{totalItems}</span> results
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage <= 1}
                    title="First page"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    title="Previous page"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center justify-center text-sm font-medium w-20">
                    {currentPage}/{totalPages}
                </div>

                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    title="Next page"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage >= totalPages}
                    title="Last page"
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
