import { getSigns } from "@/lib/db"
import { SignForm } from "@/components/sign-form"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { deleteSignAction } from "@/lib/actions"
import { Trash2, Image as ImageIcon } from "lucide-react"
import { ImagePreview } from "@/components/ui/image-preview"

export default async function SignsPage() {
    const signs = await getSigns()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Election Signs</h1>
                    <p className="text-slate-500 mt-1">Manage symbols (signs) allocated to candidates.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                    <div className="sticky top-8">
                        <SignForm />
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                            <ImageIcon className="h-5 w-5 text-indigo-500" />
                            Existing Signs ({signs.length})
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                        {signs.map((sign) => (
                            <Card key={sign.id} className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
                                <div className="aspect-square relative bg-slate-50 flex items-center justify-center p-4 border-b border-slate-50">
                                    <div className="h-full w-full">
                                        <ImagePreview
                                            src={sign.imageUrl}
                                            alt={sign.name}
                                            className="h-full w-full object-contain mix-blend-multiply"
                                        />
                                    </div>
                                </div>
                                <CardContent className="p-3 text-center bg-white">
                                    <p className="font-semibold text-slate-700 truncate text-sm" title={sign.name}>{sign.name}</p>
                                </CardContent>
                                <CardFooter className="p-3 pt-0 flex justify-center bg-white">
                                    <form action={deleteSignAction.bind(null, sign.id)} className="w-full">
                                        <Button variant="ghost" size="sm" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 h-8">
                                            <Trash2 className="w-3 h-3 mr-2" />
                                            Remove
                                        </Button>
                                    </form>
                                </CardFooter>
                            </Card>
                        ))}
                        {signs.length === 0 && (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                                <ImageIcon className="h-10 w-10 mb-2 opacity-50" />
                                <p>No signs found. Upload one to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
