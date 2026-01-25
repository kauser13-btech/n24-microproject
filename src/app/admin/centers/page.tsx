import Link from "next/link"
import { getCenters } from "@/lib/db"
import { deleteCenterAction } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Plus, Pencil, Trash2, MapPin } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function CentersPage() {
    const centers = await getCenters()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Election Centers</h1>
                    <p className="text-slate-500 mt-1">Manage polling stations and their status.</p>
                </div>
                <Link href="/admin/centers/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Center
                    </Button>
                </Link>
            </div>

            <Card className="border-0 shadow-xl shadow-slate-200/40 overflow-hidden bg-white/80 backdrop-blur-sm">
                <CardContent className="p-0">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b bg-slate-50/50">
                                <tr className="border-b transition-colors hover:bg-slate-100/50">
                                    <th className="h-14 px-6 align-middle font-semibold text-slate-500">Name</th>
                                    <th className="h-14 px-6 align-middle font-semibold text-slate-500">Location</th>
                                    <th className="h-14 px-6 align-middle font-semibold text-slate-500">Stats</th>
                                    <th className="h-14 px-6 align-middle font-semibold text-slate-500 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {centers.map((center) => (
                                    <tr key={center.id} className="border-b border-slate-100 transition-all hover:bg-slate-50/80 group">
                                        <td className="p-6 align-middle">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg text-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                    {center.seat_number}
                                                </div>
                                                <span className="font-semibold text-slate-900">{center.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 align-middle">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-700">{center.area}</span>
                                                <span className="text-xs text-slate-400 truncate max-w-[200px] mt-0.5">{center.division}, {center.district}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 align-middle">
                                            <div className="flex gap-2">
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal">
                                                    {center.total_voter || 0} Voters
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="p-6 align-middle text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/centers/${center.id}/edit`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <form action={async () => {
                                                    "use server"
                                                    await deleteCenterAction(center.id)
                                                }}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {centers.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-500">
                                                <MapPin className="h-12 w-12 mb-4 text-slate-300" />
                                                <p className="text-lg font-medium">No centers found</p>
                                                <p className="text-sm">Click "Add Center" to create one.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
