"use client"

import { useState, useRef } from "react"
import { ElectionCenter } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface CenterSearchGridProps {
    initialCenters: ElectionCenter[]
}

export function CenterSearchGrid({ initialCenters }: CenterSearchGridProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedDivision, setSelectedDivision] = useState<string>("all")
    const [selectedDistrict, setSelectedDistrict] = useState<string>("all")
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Get unique divisions
    const divisions = Array.from(new Set(initialCenters.map(c => c.division).filter(Boolean))) as string[]

    // Get unique districts based on selected division
    const districts = Array.from(new Set(
        initialCenters
            .filter(c => selectedDivision === "all" || c.division === selectedDivision)
            .map(c => c.district)
            .filter(Boolean)
            .sort()
    )) as string[]

    const filteredCenters = initialCenters.filter(center => {
        const matchesSearch = String(center.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(center.area || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
            (center.seat_number && String(center.seat_number).toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesDivision = selectedDivision === "all" || center.division === selectedDivision
        const matchesDistrict = selectedDistrict === "all" || center.district === selectedDistrict

        return matchesSearch && matchesDivision && matchesDistrict
    })

    const handleDivisionChange = (value: string) => {
        setSelectedDivision(value)
        setSelectedDistrict("all") // Reset district when division changes
    }

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <div className="h-px bg-slate-300 flex-1" />
                <h2 className="text-2xl md:text-3xl font-semibold text-white bg-red-600 px-6 py-2 rounded-lg shadow-sm">
                    আসন ও প্রার্থী
                </h2>
                <div className="h-px bg-slate-300 flex-1" />
            </div>

            <div className="w-full max-w-7xl mx-auto mb-8">
                <div className="bg-white/60 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-1.5 md:p-2">
                    <div className="flex flex-col gap-2">

                        {/* Top Row: Search & District Select */}
                        <div className="flex flex-col md:flex-row gap-2 p-2">
                            {/* Search Input */}
                            <div className="relative flex-1 group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 text-slate-400 group-focus-within:text-parliament-primary">
                                    <Search className="w-[18px]" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="আসন অনুসন্ধান করুন (যেমন: ঢাকা-১০)..."
                                    className="w-full h-12 pl-11 pr-4 bg-white/50 hover:bg-white/80 focus:bg-white border border-slate-200/60 focus:border-parliament-primary/50 rounded-2xl text-base font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-parliament-primary/10 transition-all duration-300"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    autoComplete="off"
                                />
                            </div>

                            {/* District Select */}
                            <div className="w-full md:w-72 relative">
                                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                    <SelectTrigger
                                        className="w-full h-12 py-5 px-4 bg-white/50 hover:bg-white/80 border border-slate-200/60 focus:border-parliament-primary/50 rounded-2xl text-slate-700 font-medium focus:ring-4 focus:ring-parliament-primary/10 transition-all duration-300"
                                    >
                                        <SelectValue placeholder="জেলা বাছাই করুন" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                        <SelectItem value="all" className="font-medium text-parliament-primary">সকল জেলা</SelectItem>
                                        {districts.map(dist => (
                                            <SelectItem key={dist} value={dist}>{dist}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-60" />

                        {/* Bottom Row: Division Filter Scroll */}
                        <div className="relative group/scroll px-1 pb-1">
                            {/* Scroll Gradients & Buttons - Only visible on hover/interaction ideally, but kept visible for UX */}
                            <div className="absolute left-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-r from-white/80 to-transparent pointer-events-none rounded-l-2xl" />
                            <div className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-l from-white/80 to-transparent pointer-events-none rounded-r-2xl" />

                            {/* Left Scroll Button */}
                            <button
                                onClick={() => scroll('left')}
                                className="absolute left-1 top-1/2 -translate-y-1/2 z-30 w-8 h-8 flex items-center justify-center bg-white shadow-md border border-slate-100 text-slate-600 rounded-full opacity-0 -translate-x-2 group-hover/scroll:opacity-100 group-hover/scroll:translate-x-0 transition-all duration-300 hover:bg-parliament-primary hover:text-white"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {/* Right Scroll Button */}
                            <button
                                onClick={() => scroll('right')}
                                className="absolute right-1 top-1/2 -translate-y-1/2 z-30 w-8 h-8 flex items-center justify-center bg-white shadow-md border border-slate-100 text-slate-600 rounded-full opacity-0 translate-x-2 group-hover/scroll:opacity-100 group-hover/scroll:translate-x-0 transition-all duration-300 hover:bg-parliament-primary hover:text-white"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>

                            {/* Scrollable Container */}
                            <div ref={scrollContainerRef} className="overflow-x-auto no-scrollbar scroll-smooth">
                                <div className="flex items-center gap-2 p-2 min-w-max">
                                    <button
                                        onClick={() => handleDivisionChange("all")}
                                        className={cn(
                                            "px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border select-none",
                                            selectedDivision === "all"
                                                ? "bg-parliament-primary text-white border-parliament-primary shadow-lg shadow-parliament-primary/25 scale-105"
                                                : "bg-white text-slate-500 border-slate-200/60 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                                        )}
                                    >
                                        সকল বিভাগ
                                    </button>

                                    {divisions.map(div => (
                                        <button
                                            key={div}
                                            onClick={() => handleDivisionChange(div)}
                                            className={cn(
                                                "px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border select-none",
                                                selectedDivision === div
                                                    ? "bg-parliament-primary text-white border-parliament-primary shadow-lg shadow-parliament-primary/25 scale-105"
                                                    : "bg-white text-slate-500 border-slate-200/60 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
                                            )}
                                        >
                                            {div}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Center List */}
            <div className="h-[500px] rounded-xl overflow-y-auto border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min custom-scrollbar">
                {filteredCenters.map((center) => (
                    <Link key={center.id} href={`/centers/${center.id}`}>
                        <Card className="group relative overflow-hidden rounded-xl border-slate-200/60 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
                            {/* Top Accent Line */}
                            <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />

                            <CardHeader className="flex flex-row items-start justify-between space-y-0 px-5 pb-4 pt-5">
                                <div className="space-y-1.5">
                                    <CardTitle className="text-base font-semibold text-slate-800 leading-tight tracking-tight">
                                        {center.name}
                                    </CardTitle>
                                    <CardDescription className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                                        {center.area}
                                    </CardDescription>
                                </div>

                                {center.seat_number && (
                                    <Badge className="bg-indigo-50 min-w-24 text-center text-indigo-700 border-indigo-100 text-sm font-semibold px-2.5 py-0.5 shadow-sm">
                                        {"আসন: " + center.id_bn}
                                    </Badge>
                                )}
                            </CardHeader>

                            <CardContent className="px-5 pb-5">
                                <div className="flex items-center justify-between gap-3">
                                    {/* Metadata Badges */}
                                    <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wider text-slate-500 font-medium">
                                        <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100">
                                            {center.division}
                                        </Badge>
                                        <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100">
                                            {center.district}
                                        </Badge>
                                    </div>

                                    {/* Action Button */}

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                    >
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                {filteredCenters.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                        <div className="bg-slate-50 p-4 rounded-full mb-4">
                            <MapPin className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No centers found</h3>
                        <p className="text-slate-500 mt-1 max-w-sm mx-auto">
                            We couldn't find any election centers matching your filters. Try adjusting your search criteria.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
