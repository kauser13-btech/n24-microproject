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

    const filteredCenters = initialCenters.filter(center =>
        center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        center.area.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-8">
            <div className="relative max-w-xl mx-auto">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
                    <Search className="h-5 w-5" />
                </div>
                <Input
                    className="pl-10 h-12 text-lg shadow-sm"
                    placeholder="Search by name or area..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCenters.map((center) => (
                    <Card key={center.id} className="group hover:shadow-lg hover:border-indigo-200 transition-all duration-300">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl group-hover:text-indigo-600 transition-colors">
                                    {center.name}
                                </CardTitle>
                            </div>
                            <CardDescription className="flex items-center gap-1.5 mt-1">
                                <MapPin className="h-4 w-4" />
                                {center.area}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Badge variant="secondary" className="text-xs">
                                    {center.district}
                                </Badge>
                                {center.seat_number && (
                                    <Badge variant="outline" className="text-xs">
                                        {center.seat_number}
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Link href={`/centers/${center.id}`} className="w-full">
                                <Button variant="outline" className="w-full group-hover:bg-indigo-50 group-hover:text-indigo-700 group-hover:border-indigo-200">
                                    View Details
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}

                {filteredCenters.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        No election centers found matching "{searchTerm}".
                    </div>
                )}
            </div>
        </div>
    )
}
