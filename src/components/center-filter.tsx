"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ElectionCenter } from "@/lib/types"

interface CenterFilterProps {
    centers: ElectionCenter[]
    currentCenterId?: string
}

export function CenterFilter({ centers, currentCenterId }: CenterFilterProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")

    const filteredCenters = useMemo(() => {
        if (!search) return centers
        return centers.filter(center =>
            center.name.toLowerCase().includes(search.toLowerCase()) ||
            center.area.toLowerCase().includes(search.toLowerCase())
        )
    }, [centers, search])

    const selectedCenter = centers.find(c => c.id === currentCenterId)

    const handleSelect = (centerId: string) => {
        setOpen(false)
        router.push(`/admin/candidates?centerId=${centerId}`)
    }

    const clearFilter = () => {
        setOpen(false)
        setSearch("")
        router.push("/admin/candidates")
    }

    return (
        <div className="relative w-[300px]">
            <div className="flex gap-2">
                <div className="relative w-full">
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-white"
                        onClick={() => setOpen(!open)}
                    >
                        {selectedCenter ? selectedCenter.name : "Filter by Center..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>

                    {open && (
                        <div className="absolute top-full left-0 z-50 mt-2 w-full rounded-md border border-slate-200 bg-white shadow-lg p-2">
                            <input
                                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 mb-2"
                                placeholder="Search center..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                            />
                            <div className="max-h-[300px] overflow-auto space-y-1">
                                {filteredCenters.length === 0 ? (
                                    <div className="py-6 text-center text-sm text-slate-500">No center found.</div>
                                ) : (
                                    filteredCenters.map((center) => (
                                        <div
                                            key={center.id}
                                            className={`flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-slate-100 ${center.id === currentCenterId ? "bg-slate-50 font-medium" : ""
                                                }`}
                                            onClick={() => handleSelect(center.id as string)}
                                        >
                                            <div className="flex flex-col">
                                                <span>{center.name}</span>
                                                <span className="text-xs text-slate-400">{center.area}</span>
                                            </div>
                                            {center.id === currentCenterId && (
                                                <Check className="h-4 w-4 text-indigo-600" />
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {currentCenterId && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={clearFilter}
                        className="shrink-0 text-slate-500 hover:text-red-500"
                        title="Clear filter"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {open && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setOpen(false)}
                />
            )}
        </div>
    )
}
