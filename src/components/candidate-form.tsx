"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, User, MapPin, Flag } from "lucide-react"

interface CandidateFormProps {
    initialData?: any
    centers: any[]

    signs: any[]
    action: (formData: FormData) => void
    title: string
    description: string
}

export function CandidateForm({ initialData, centers, signs, action, title, description }: CandidateFormProps) {
    const [preview, setPreview] = useState(initialData?.photoUrl || initialData?.photo || "")
    const [formData, setFormData] = useState(initialData)

    // Update local state to match initialData
    useEffect(() => {
        setFormData(initialData)
        if (initialData?.photoUrl) {
            setPreview(initialData.photoUrl)
        } else if (initialData?.photo) {
            setPreview(initialData.photo)
        }
    }, [initialData])

    // Handle Image Preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPreview(URL.createObjectURL(file))
        }
    }

    // Handle Input Change (for real-time preview)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev: any) => ({ ...prev, [name]: value }))
    }


    return (
        <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
                <p className="mt-2 text-slate-500">{description}</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

                {/* LEFT COLUMN: Form */}
                <div className="lg:col-span-8">
                    <Card className="border-slate-200 shadow-sm">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-lg">Candidate Information</CardTitle>
                            <CardDescription>Fill in the details below. The preview on the right will update automatically.</CardDescription>
                        </CardHeader>

                        <CardContent className="pt-6">
                            <form action={action} className="space-y-6">

                                {/* Name & Party */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={formData?.name}
                                            onChange={handleChange}
                                            placeholder="e.g. John Doe"
                                            className="h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="party">Political Party</Label>
                                        <Input
                                            id="party"
                                            name="party"
                                            defaultValue={formData?.party}
                                            onChange={handleChange}
                                            placeholder="e.g. Independent"
                                            className="h-11"
                                        />
                                    </div>
                                </div>

                                {/* Center & Status */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="assignedCenterId">Election Center</Label>
                                        <Select name="assignedCenterId" defaultValue={String(formData?.assignedCenterId || "")}>
                                            <SelectTrigger className="h-11 w-full bg-white">
                                                <SelectValue placeholder="Select a center" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {centers.map((center) => (
                                                    <SelectItem key={center.id} value={String(center.id)}>
                                                        {center.name} ({center.area})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signId">Candidate Sign (Symbol)</Label>
                                        <Select name="signId" defaultValue={formData?.signId || ""}>
                                            <SelectTrigger className="h-11 w-full bg-white">
                                                <SelectValue placeholder="Select a sign" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {signs.map((sign) => (
                                                    <SelectItem key={sign.id} value={sign.id}>
                                                        {sign.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <Label htmlFor="photoUrl">Candidate Photo</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="relative w-full">
                                            <Input
                                                id="photoUrl"
                                                name="photoUrl"
                                                type="text"
                                                defaultValue={formData?.photoUrl}
                                                onChange={handleChange}
                                                placeholder="Enter photo URL"
                                                className="h-11 mb-2"
                                            />
                                            <Input
                                                id="photoFile"
                                                name="photoFile"
                                                type="file"
                                                onChange={handleImageChange}
                                                className="h-11 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500">Recommended: 400x400px PNG or JPG.</p>
                                </div>

                                {/* Documents Upload */}
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <h3 className="font-semibold text-sm text-slate-700">Candidate Documents</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="affidavitFile" className="text-xs">Affidavit (PDF)</Label>
                                            <Input
                                                id="affidavitFile"
                                                name="affidavitFile"
                                                type="file"
                                                accept=".pdf"
                                                className="h-10 text-xs"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="nominationFile" className="text-xs">Nomination (PDF)</Label>
                                            <Input
                                                id="nominationFile"
                                                name="nominationFile"
                                                type="file"
                                                accept=".pdf"
                                                className="h-10 text-xs"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="taxFile" className="text-xs">Tax Return (PDF)</Label>
                                            <Input
                                                id="taxFile"
                                                name="taxFile"
                                                type="file"
                                                accept=".pdf"
                                                className="h-10 text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Biography / Manifesto</Label>
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        defaultValue={formData?.bio}
                                        onChange={handleChange}
                                        placeholder="Brief description of the candidate..."
                                        rows={4}
                                    />
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <Button type="button" variant="outline" onClick={() => window.history.back()} size="lg">Cancel</Button>
                                    <Button type="submit" size="lg" className="bg-indigo-600 hover:bg-indigo-700 px-8 shadow-lg shadow-indigo-200">
                                        Save Changes
                                    </Button>
                                </div>

                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: Large Preview (Sticky) */}
                <div className="lg:col-span-4">
                    <div className="sticky top-8 space-y-6">

                        <div className="flex items-center justify-between px-1">
                            <h3 className="font-semibold text-slate-900">Live Preview</h3>
                            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                                Public View
                            </span>
                        </div>

                        {/* Preview Card */}
                        <Card className="overflow-hidden border-slate-200 shadow-xl">
                            <div className="relative h-64 bg-slate-900 flex items-center justify-center overflow-hidden">
                                {/* Background Pattern */}
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-400 via-slate-900 to-black"></div>

                                {/* Large Image */}
                                <div className="relative z-10 w-40 h-40 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden bg-slate-800">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-slate-500">
                                            <User className="h-16 w-16 opacity-50" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 text-center">
                                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                                    {formData?.name || "Candidate Name"}
                                </h2>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wide mb-4">
                                    <Flag className="h-3 w-3" />
                                    {formData?.party || "Party Name"}
                                </div>

                                <div className="space-y-3 text-left mt-6 bg-slate-50 rounded-lg p-4 border border-slate-100">
                                    <div className="flex items-start gap-3 text-sm text-slate-600">
                                        <MapPin className="h-5 w-5 text-rose-500 mt-0.5 shrink-0" />
                                        <span>
                                            <span className="block font-semibold text-slate-900 text-xs uppercase tracking-wider">Constituency</span>
                                            {centers.find(c => String(c.id) === String(formData?.assignedCenterId))?.name || "Select a center..."}
                                        </span>
                                    </div>
                                    <div className="flex items-start gap-3 text-sm text-slate-600">
                                        <div className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mt-0.5 shrink-0 text-xs font-bold">
                                            ID
                                        </div>
                                        <span>
                                            <span className="block font-semibold text-slate-900 text-xs uppercase tracking-wider">Candidate ID</span>
                                            #{formData?.id || "N/A"}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <p className="text-sm text-slate-500 italic line-clamp-3">
                                        {formData?.bio || "No biography added yet..."}
                                    </p>
                                </div>
                            </div>
                        </Card>

                    </div>
                </div>

            </div>
        </div>
    )
}
