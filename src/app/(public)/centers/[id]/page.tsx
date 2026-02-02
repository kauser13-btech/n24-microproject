import { getCenterById, getCandidatesByCenter, getSigns } from "@/lib/db"
import { notFound } from "next/navigation"
import Link from "next/link"
import fs from "fs"
import path from "path"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, MapPin, Users, Info, FileText, Download, User, Vote, Building2, Hash, UserCheck } from "lucide-react"

interface PageProps {
    params: Promise<{
        id: number
    }>
}

export const dynamic = 'force-dynamic'

// Reusable StatCard Component (from ElectionDashboard)
const StatCard = ({ label, value, icon: Icon }: { label: string, value: string, icon: any }) => {
    return (
        <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 hover:bg-slate-50 transition-all duration-300 group cursor-default border-b border-r border-slate-100 last:border-0 border-r-0 md:border-r">
            <div className="flex items-center gap-3 md:contents">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white">
                    <Icon className="size-5" />
                </div>
                <div className="md:hidden text-slate-500 font-normal opacity-80">
                    {label}
                </div>
            </div>
            <div className="min-w-0">
                <div className="text-xl md:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 leading-tight tracking-tight transition-all duration-500">
                    {value}
                </div>
                <div className="hidden md:block text-[13px] text-slate-500 font-normal opacity-80">
                    {label}
                </div>
            </div>
        </div>
    );
};

// Helper to check for documents
const getCandidateDocuments = (candidateId: number) => {
    const publicDir = path.join(process.cwd(), 'public')
    const candidateDir = path.join(publicDir, 'candidates', candidateId.toString())

    const documents = [
        { id: 'affidavit', name: 'হলফনামা', filename: 'affidavit.pdf' },
        { id: 'nomination', name: 'মনোনয়ন পত্র', filename: 'nomination_paper.pdf' },
        { id: 'tax', name: 'আয়কর রিটার্ন', filename: 'tax_return.pdf' },
    ]

    return documents.filter(doc => {
        const filePath = path.join(candidateDir, doc.filename)
        return fs.existsSync(filePath)
    })
}

export default async function CenterDetailsPage({ params }: PageProps) {
    const { id } = await params
    const center = await getCenterById(id)

    if (!center) {
        notFound()
    }

    const candidatesData = await getCandidatesByCenter(center.id)
    const signs = await getSigns()

    // Attach documents to candidates
    const candidates = await Promise.all(candidatesData.map(async (candidate) => {
        const docs = getCandidateDocuments(Number(candidate.id)) // Ensure ID is number for path
        return { ...candidate, docs }
    }))

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Link href="/">
                <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-indigo-600">
                    <ArrowLeft className="mr-2 h-4 w-4" /> পূর্ববর্তী পৃষ্ঠা
                </Button>
            </Link>

            {/* Page Header: Name & Area */}
            <div className="mb-8 text-center space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                    {center.name}
                </h1>
                <div className="flex items-center justify-center gap-2 text-slate-500">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">{center.area}</span>
                </div>
            </div>

            {/* Center Info (Stats Section) */}
            <section id="stats" className="container mx-auto px-4 mb-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-slate-300 flex-1" />
                    <h2 className="text-2xl md:text-3xl font-semibold text-white bg-red-600 px-6 py-2 rounded-lg shadow-sm">
                        সংক্ষিপ্ত তথ্য
                    </h2>
                    <div className="h-px bg-slate-300 flex-1" />
                </div>

                <div className="bg-white/60 backdrop-blur-xl border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    {/* Upper Row: Location & ID Info */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 bg-transparent h-full">
                        {/* Seat Number */}
                        <StatCard
                            label="আসন নম্বর"
                            value={"আসন: " + center.id_bn}
                            icon={Vote}
                        />
                        {/* District */}
                        <StatCard
                            label="জেলা"
                            value={center.district || "N/A"}
                            icon={MapPin}
                        />
                        {/* Division */}
                        <StatCard
                            label="বিভাগ"
                            value={center.division || "N/A"}
                            icon={Building2} // or another icon
                        />
                        <StatCard
                            label="মোট প্রার্থী"
                            value={candidates.length.toLocaleString('bn-BD')}
                            icon={UserCheck}
                        />
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-slate-100 w-full" />

                    {/* Lower Row: Voter Stats */}
                    <div className="bg-slate-50/30">
                        <div className="grid grid-cols-2 lg:grid-cols-4 bg-transparent h-full">
                            {/* Total Voters */}
                            <StatCard
                                label="মোট ভোটার"
                                value={center.total_voter?.toLocaleString('bn-BD') || '-'}
                                icon={Users}
                            />
                            {/* Male Voters */}
                            <StatCard
                                label="পুরুষ ভোটার"
                                value={center.male_voter?.toLocaleString('bn-BD') || '-'}
                                icon={User}
                            />
                            {/* Female Voters */}
                            <StatCard
                                label="নারী ভোটার"
                                value={center.female_voter?.toLocaleString('bn-BD') || '-'}
                                icon={User}
                            />
                            {/* Transgender Voters */}
                            <StatCard
                                label="হিজড়া ভোটার"
                                value={center.transgender_voter?.toLocaleString('bn-BD') || '-'}
                                icon={User}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Candidates */}
            <section id="stats" className="container mx-auto px-4 mb-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-px bg-slate-300 flex-1" />
                    <h2 className="text-2xl md:text-3xl font-semibold text-white bg-red-600 px-6 py-2 rounded-lg shadow-sm">
                        প্রার্থী
                    </h2>
                    <div className="h-px bg-slate-300 flex-1" />
                </div>

                {candidates.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {candidates.map((candidate) => {
                            const sign = signs.find(s => s.id === candidate.signId)
                            return (
                                <Card key={candidate.id} className="group relative overflow-hidden border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl">
                                    <CardContent className="flex flex-col items-center gap-5 p-6">

                                        {/* Profile Image Section */}
                                        <div className="relative shrink-0">
                                            {/* Main Profile Image */}
                                            <img
                                                src={`/candidates/${candidate.id}/profile_image.jpg`}
                                                alt={candidate.name}
                                                className="h-32 w-32 md:h-36 md:w-36 rounded-full object-cover border-4 border-white shadow-md ring-1 ring-slate-100"
                                            />

                                            {/* Symbol Badge Overlay */}
                                            {sign && (
                                                <div className="absolute -bottom-1 -right-1 h-12 w-12 rounded-full border-2 border-white bg-white shadow-sm flex items-center justify-center p-1.5">
                                                    <img
                                                        src={`/symbols/${sign.imageUrl}`}
                                                        alt={sign.name}
                                                        title={sign.name}
                                                        className="max-h-full max-w-full object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        {/* Text Information */}
                                        <div className="text-center space-y-1.5 w-full">
                                            {/* Candidate Name */}
                                            <h3 className="text-xl font-bold text-slate-900 leading-tight tracking-tight">
                                                {candidate.name}
                                            </h3>

                                            {/* Election Sign / Symbol Badge */}
                                            {sign && (
                                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                                                    প্রতীক: {sign.name}
                                                </p>
                                            )}


                                            {/* Party Name */}
                                            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
                                                <span className="text-xs font-semibold text-slate-700">
                                                    {candidate.party}
                                                </span>
                                            </div>

                                        </div>

                                        {/* Documents Section */}
                                        {candidate.docs && candidate.docs.length > 0 && (
                                            <div className="w-full pt-4 mt-2 border-t border-slate-100 flex flex-col gap-2">
                                                {candidate.docs.map((doc) => (
                                                    <a
                                                        key={doc.id}
                                                        href={`/candidates/${candidate.id}/${doc.filename}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition-colors group/doc"
                                                    >
                                                        <div className="flex items-center gap-2.5 overflow-hidden">
                                                            <FileText className="h-4 w-4 text-slate-400 group-hover/doc:text-indigo-500 flex-shrink-0" />
                                                            <span className="text-sm font-medium text-slate-600 group-hover/doc:text-indigo-700 truncate">
                                                                {doc.name}
                                                            </span>
                                                        </div>
                                                        <Download className="h-3.5 w-3.5 text-slate-400 group-hover/doc:text-indigo-500 flex-shrink-0" />
                                                    </a>
                                                ))}
                                            </div>
                                        )}

                                    </CardContent>
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
            </section >
        </div>
    )
}
