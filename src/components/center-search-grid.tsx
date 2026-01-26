"use client"

import { useState } from "react"
import { ElectionCenter } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, ArrowRight } from "lucide-react"
import Link from "next/link"

interface CenterSearchGridProps {
    initialCenters: ElectionCenter[]
}

export function CenterSearchGrid({ initialCenters }: CenterSearchGridProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedDivision, setSelectedDivision] = useState<string>("all")
    const [selectedDistrict, setSelectedDistrict] = useState<string>("all")

    // Get unique divisions
    const divisions = Array.from(new Set(initialCenters.map(c => c.division).filter(Boolean))) as string[]

    // Get unique districts based on selected division
    const districts = Array.from(new Set(
        initialCenters
            .filter(c => selectedDivision === "all" || c.division === selectedDivision)
            .map(c => c.district)
            .filter(Boolean)
    )) as string[]

    const filteredCenters = initialCenters.filter(center => {
        const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            center.area.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesDivision = selectedDivision === "all" || center.division === selectedDivision
        const matchesDistrict = selectedDistrict === "all" || center.district === selectedDistrict

        return matchesSearch && matchesDivision && matchesDistrict
    })

    const handleDivisionChange = (value: string) => {
        setSelectedDivision(value)
        setSelectedDistrict("all") // Reset district when division changes
    }

    return (
        <div className="space-y-8">
            <div className="space-y-4 max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                            <Search className="h-5 w-5" />
                        </div>
                        <Input
                            className="pl-10 h-12 text-lg shadow-sm"
                            placeholder="নাম বা এলাকা অনুসারে অনুসন্ধান করুন..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Division Select */}
                    <div className="w-full md:w-48">
                        <select
                            className="w-full h-12 px-3 py-2 shadow-sm rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                            value={selectedDivision}
                            onChange={(e) => handleDivisionChange(e.target.value)}
                        >
                            <option value="all">সকল দিভাগ</option>
                            {divisions.map(div => (
                                <option key={div} value={div}>{div}</option>
                            ))}
                        </select>
                    </div>

                    {/* District Select */}
                    <div className="w-full md:w-48">
                        <select
                            className="w-full h-12 px-3 py-2 shadow-sm rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                            value={selectedDistrict}
                            onChange={(e) => setSelectedDistrict(e.target.value)}
                        >
                            <option value="all">সকল জেলা</option>
                            {districts.map(dist => (
                                <option key={dist} value={dist}>{dist}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCenters.map((center) => (
                    <Card
                        key={center.id}
                        className="group relative overflow-hidden border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        {/* Top Accent Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />

                        <CardHeader className="pt-6 pb-4">
                            <div className="flex justify-between items-start gap-2">
                                <CardTitle className="text-xl font-semibold text-slate-800 leading-tight">
                                    {center.name}
                                </CardTitle>
                                {center.seat_number && (
                                    <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100 text-2xl font-medium">
                                        {center.seat_number}
                                    </Badge>
                                )}
                            </div>
                            <CardDescription className="flex items-center gap-1.5 mt-2 text-slate-500">
                                {center.area}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pb-4">
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">
                                    {center.division}
                                </Badge>
                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200">
                                    {center.district}
                                </Badge>
                            </div>
                        </CardContent>

                        <CardFooter className="pt-0 pb-6">
                            <Link href={`/centers/${center.id}`} className="w-full">
                                <Button className="w-full bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all group-hover:shadow-md">
                                    View Details
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
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
