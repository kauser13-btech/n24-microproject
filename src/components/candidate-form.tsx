"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Candidate, ElectionCenter, Sign } from "@/lib/types"

interface CandidateFormProps {
    initialData?: Candidate
    centers: ElectionCenter[]
    signs: Sign[]
    action: (formData: FormData) => Promise<void>
    title: string
    description: string
}

import { ImagePreview } from "@/components/ui/image-preview"

// ... imports

export function CandidateForm({ initialData, centers, signs, action, title, description }: CandidateFormProps) {
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <form action={action}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium leading-none">
                            Candidate Name
                        </label>
                        <Input id="name" name="name" defaultValue={initialData?.name} required placeholder="e.g. Sarah Johnson" />
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="party" className="text-sm font-medium leading-none">
                                Party Affiliation
                            </label>
                            <Input id="party" name="party" defaultValue={initialData?.party} required placeholder="e.g. Progressive Alliance" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="photoUrl" className="text-sm font-medium leading-none">
                            Candidate Photo URL
                        </label>
                        <div className="flex gap-4 items-start">
                            <Input id="photoUrl" name="photoUrl" defaultValue={initialData?.photoUrl} placeholder="https://example.com/photo.jpg" />
                            {initialData?.photoUrl && (
                                <div className="shrink-0">
                                    <ImagePreview src={initialData.photoUrl} alt="Current Photo" className="h-10 w-10 rounded-full object-cover border" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="photoFile" className="text-sm font-medium leading-none">
                            Or Upload Photo
                        </label>
                        <Input id="photoFile" name="photoFile" type="file" accept="image/*" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="assignedCenterId" className="text-sm font-medium leading-none">
                            Assigned Election Center
                        </label>
                        <div className="relative">
                            <select
                                id="assignedCenterId"
                                name="assignedCenterId"
                                defaultValue={initialData?.assignedCenterId}
                                required
                                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="" disabled>Select a center</option>
                                {centers.map(center => (
                                    <option key={center.id} value={center.id}>
                                        {center.name} ({center.area})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="signId" className="text-sm font-medium leading-none">
                            Candidate Sign (Symbol)
                        </label>
                        <div className="relative">
                            <select
                                id="signId"
                                name="signId"
                                defaultValue={initialData?.signId || ""}
                                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Select a sign (optional)</option>
                                {signs.map(sign => (
                                    <option key={sign.id} value={sign.id}>
                                        {sign.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>


                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>Cancel</Button>
                    <Button type="submit">{initialData ? 'Update Candidate' : 'Add Candidate'}</Button>
                </CardFooter>
            </form>
        </Card>
    )
}
