"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ElectionCenter } from "@/lib/types"
import { useState, useMemo } from "react"
import districtsData from "@/data/districts.json"

interface CenterFormProps {
    initialData?: ElectionCenter
    action: (formData: FormData) => Promise<void>
    title: string
    description: string
}
export function CenterForm({ initialData, action, title, description }: CenterFormProps) {
    // Get unique divisions
    const divisions = useMemo(() => {
        const uniqueDivisions = new Set(districtsData.map(d => d.division_id))
        return Array.from(uniqueDivisions).sort()
    }, [])

    const [selectedDivision, setSelectedDivision] = useState(initialData?.division || "")
    const [selectedDistrict, setSelectedDistrict] = useState(initialData?.district || "")

    // Filter districts based on selected division
    const availableDistricts = useMemo(() => {
        if (!selectedDivision) return []
        return districtsData
            .filter(d => d.division_id === selectedDivision)
            .sort((a, b) => a.name.localeCompare(b.name))
    }, [selectedDivision])

    const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const division = e.target.value
        setSelectedDivision(division)
        setSelectedDistrict("") // Reset district when division changes
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <form action={action}>
                <CardContent className="space-y-4">
                    {/* ... existing fields ... */}
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Center Name
                        </label>
                        <Input id="name" name="name" defaultValue={initialData?.name} required placeholder="e.g. Downtown Community Hall" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="area" className="text-sm font-medium leading-none">
                            Area / Address
                        </label>
                        <Input id="area" name="area" defaultValue={initialData?.area} required placeholder="e.g. 123 Main St, New York, NY" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="seat_number" className="text-sm font-medium leading-none">
                                Seat Number
                            </label>
                            <Input id="seat_number" name="seat_number" defaultValue={initialData?.seat_number} placeholder="e.g. CA-34" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="division" className="text-sm font-medium leading-none">
                                Division
                            </label>
                            <div className="relative">
                                <select
                                    id="division"
                                    name="division"
                                    value={selectedDivision}
                                    onChange={handleDivisionChange}
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Select Division</option>
                                    {divisions.map(div => (
                                        <option key={div} value={div}>{div}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="district" className="text-sm font-medium leading-none">
                                District
                            </label>
                            <div className="relative">
                                <select
                                    id="district"
                                    name="district"
                                    value={selectedDistrict}
                                    onChange={(e) => setSelectedDistrict(e.target.value)}
                                    disabled={!selectedDivision}
                                    className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="">Select District</option>
                                    {availableDistricts.map(dist => (
                                        <option key={dist.name} value={dist.name}>{dist.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="total_voter" className="text-sm font-medium leading-none">
                                Total Voters
                            </label>
                            <Input id="total_voter" name="total_voter" type="number" defaultValue={initialData?.total_voter} placeholder="0" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="male_voter" className="text-sm font-medium leading-none">
                                Male Voters
                            </label>
                            <Input id="male_voter" name="male_voter" type="number" defaultValue={initialData?.male_voter} placeholder="0" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="female_voter" className="text-sm font-medium leading-none">
                                Female Voters
                            </label>
                            <Input id="female_voter" name="female_voter" type="number" defaultValue={initialData?.female_voter} placeholder="0" />
                        </div>
                    </div>


                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                    <Button type="submit">{initialData ? 'Update Center' : 'Create Center'}</Button>
                </CardFooter>
            </form>
        </Card>
    )
}
