import { getCenterById, getCandidatesByCenter, getSigns } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, MapPin, Users, Info } from "lucide-react"

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export const dynamic = 'force-dynamic'

export default async function CenterDetailsPage({ params }: PageProps) {
    const { id } = await params
    const center = await getCenterById(id)

    if (!center) {
        notFound()
    }

    const candidates = await getCandidatesByCenter(center.id)
    const signs = await getSigns()

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Link href="/">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-indigo-600">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Centers
                </Button>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Center Info */}
                <div className="md:col-span-1 space-y-6">
                    <Card className="border-indigo-100 shadow-md">
                        <CardContent className="p-6 space-y-6">
                            <div>

                                <h1 className="text-2xl font-bold text-slate-900">{center.name}</h1>

                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3 text-slate-600">
                                    <MapPin className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                                    <span className="text-sm font-medium">{center.area}</span>
                                </div>

                                {center.district && (
                                    <div className="flex flex-col gap-1 p-3 bg-slate-50 rounded-md text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">District:</span>
                                            <span className="font-medium text-slate-900">{center.district}</span>
                                        </div>
                                        {center.division && (
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Division:</span>
                                                <span className="font-medium text-slate-900">{center.division}</span>
                                            </div>
                                        )}
                                        {center.seat_number && (
                                            <div className="flex justify-between">
                                                <span className="text-slate-500">Seat No:</span>
                                                <span className="font-medium text-slate-900">{center.seat_number}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-slate-600">
                                        <Users className="h-5 w-5 text-indigo-500 shrink-0" />
                                        <span className="text-sm font-medium">Voter Statistics</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-slate-50 p-2 rounded">
                                            <span className="block text-slate-500">Total</span>
                                            <span className="font-semibold text-slate-900">{center.total_voter?.toLocaleString() || '-'}</span>
                                        </div>

                                        <div className="bg-slate-50 p-2 rounded">
                                            <span className="block text-slate-500">Male</span>
                                            <span className="font-semibold text-blue-600">{center.male_voter?.toLocaleString() || '-'}</span>
                                        </div>
                                        <div className="bg-slate-50 p-2 rounded">
                                            <span className="block text-slate-500">Female</span>
                                            <span className="font-semibold text-pink-600">{center.female_voter?.toLocaleString() || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Candidates */}
                <div className="md:col-span-2">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-900">Candidates</h2>
                        <p className="text-slate-500">Candidates running for office in this district.</p>
                    </div>

                    {candidates.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {candidates.map((candidate) => {
                                const sign = signs.find(s => s.id === candidate.signId)
                                return (
                                    <Card key={candidate.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="flex items-center p-4 gap-4">
                                            <img
                                                src={candidate.photoUrl || "https://ui-avatars.com/api/?name=" + candidate.name}
                                                alt={candidate.name}
                                                className="h-16 w-16 rounded-full object-cover border-2 border-slate-100 shrink-0 bg-slate-200"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-slate-900">{candidate.name}</h3>
                                                <p className="text-xs text-slate-500 mt-1">{candidate.party}</p>
                                            </div>
                                            {sign && (
                                                <div className="shrink-0 flex flex-col items-center">
                                                    <div className="h-12 w-12 relative items-center justify-center flex">
                                                        <img
                                                            src={sign.imageUrl}
                                                            alt={sign.name}
                                                            title={sign.name}
                                                            className="max-h-full max-w-full object-contain"
                                                        />
                                                    </div>
                                                    <span className="text-[10px] text-slate-500 truncate max-w-[60px]">{sign.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-lg p-8 text-center border border-dashed border-slate-300 text-slate-500">
                            <Info className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                            <p>No candidates listed for this center yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
