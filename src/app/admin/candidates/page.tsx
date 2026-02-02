import Link from "next/link"
import { getCandidates, getCenters, getCandidatesByCenter, getSigns } from "@/lib/db"
import { deleteCandidateAction } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Plus, Pencil, Trash2, Users } from "lucide-react"
import { ImagePreview } from "@/components/ui/image-preview"
import { CenterFilter } from "@/components/center-filter"
import { Pagination } from "@/components/ui/pagination"

export const dynamic = 'force-dynamic'

interface CandidatesPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const ITEMS_PER_PAGE = 20

export default async function CandidatesPage(props: CandidatesPageProps) {
    const searchParams = await props.searchParams
    const centerId = searchParams.centerId as string | undefined
    const currentPage = Number(searchParams.page) || 1

    const allCandidates = centerId
        ? await getCandidatesByCenter(Number(centerId))
        : await getCandidates()

    const totalItems = allCandidates.length
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    const candidates = allCandidates.slice(start, end)

    const centers = await getCenters()
    const signs = await getSigns()

    // Helper to get center name
    const getCenterName = (id: string) => centers.find(c => String(c.id) === String(id))?.name || "Unknown Center"
    const getSign = (id?: string) => signs.find(s => s.id === id)

    // Get filter context name
    const currentCenterName = centerId ? getCenterName(centerId) : null

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Candidates</h1>
                    <p className="text-slate-500 mt-1">Manage election candidates and their assignments.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <CenterFilter centers={centers} currentCenterId={centerId} />
                    <Link href="/admin/candidates/new">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5 w-full sm:w-auto">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Candidate
                        </Button>
                    </Link>
                </div>
            </div>

            {currentCenterName && (
                <div className="bg-indigo-50 border border-indigo-100 px-4 py-3 rounded-lg text-indigo-800 text-sm font-medium flex items-center justify-between">
                    <span>
                        Showing {allCandidates.length} candidate{allCandidates.length !== 1 ? 's' : ''} assigned to <span className="font-bold">{currentCenterName}</span>
                    </span>
                    {!allCandidates.length && (
                        <span className="text-indigo-600 font-normal">No candidates found for this center.</span>
                    )}
                </div>
            )}

            <Card className="border-0 shadow-xl shadow-slate-200/40 overflow-hidden bg-white/80 backdrop-blur-sm">
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b bg-slate-50/50">
                                <tr className="border-b transition-colors hover:bg-slate-100/50">
                                    <th className="h-14 px-6 align-middle font-semibold text-slate-500 w-[80px]">Photo</th>
                                    <th className="h-14 px-6 align-middle font-semibold text-slate-500">Name</th>
                                    <th className="h-14 px-6 align-middle font-semibold text-slate-500">Party</th>
                                    <th className="h-14 px-6 align-middle font-semibold text-slate-500">Sign</th>
                                    <th className="h-14 px-6 align-middle font-semibold text-slate-500">Assigned Center</th>
                                    <th className="h-14 px-6 align-middle font-semibold text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {candidates.map((candidate) => {
                                    const sign = getSign(candidate.signId)
                                    return (
                                        <tr key={candidate.id} className="border-b border-slate-100 transition-all hover:bg-slate-50/80 group">
                                            <td className="p-6 align-middle">
                                                <ImagePreview
                                                    src={candidate.photoUrl}
                                                    alt={candidate.name}
                                                    className="h-12 w-12 rounded-full border-2 border-slate-100 shadow-sm"
                                                />
                                            </td>
                                            <td className="p-6 align-middle">
                                                <div className="font-semibold text-slate-900">{candidate.name}</div>
                                            </td>
                                            <td className="p-6 align-middle">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                    {candidate.party}
                                                </span>
                                            </td>
                                            <td className="p-6 align-middle">
                                                {sign ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 shrink-0 p-1 bg-white rounded-lg border border-slate-100 shadow-sm">
                                                            <ImagePreview
                                                                src={sign.imageUrl}
                                                                alt={sign.name}
                                                                className="h-full w-full object-contain"
                                                            />
                                                        </div>
                                                        <span className="text-slate-600 font-medium">{sign.name}</span>
                                                    </div>
                                                ) : <span className="text-slate-400 italic text-xs">No Sign</span>}
                                            </td>
                                            <td className="p-6 align-middle text-indigo-600 font-medium">
                                                {getCenterName(candidate.assignedCenterId)}
                                            </td>
                                            <td className="p-6 align-middle text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link href={`/admin/candidates/${candidate.id}/edit`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <form action={async () => {
                                                        "use server"
                                                        await deleteCandidateAction(candidate.id)
                                                    }}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                                {candidates.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-500">
                                                <Users className="h-12 w-12 mb-4 text-slate-300" />
                                                <p className="text-lg font-medium">No candidates found{centerId ? ' for this center' : ''}</p>
                                                <p className="text-sm">
                                                    {centerId
                                                        ? <Link href="/admin/candidates" className="text-indigo-600 hover:underline">Clear filter</Link>
                                                        : "Get started by adding a new candidate."
                                                    }
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
                {totalItems > ITEMS_PER_PAGE && (
                    <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4">
                        <div className="w-full">
                            <Pagination
                                totalItems={totalItems}
                                itemsPerPage={ITEMS_PER_PAGE}
                                currentPage={currentPage}
                            />
                        </div>
                    </CardFooter>
                )}
            </Card>
        </div>
    )
}
