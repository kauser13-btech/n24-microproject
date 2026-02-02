import { getCandidates, getCenters, getSigns, getCandidateById } from "@/lib/db"
import { updateCandidateAction } from "@/lib/actions"
import { CandidateForm } from "@/components/candidate-form"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditCandidatePage({ params }: PageProps) {
    const { id } = await params
    const candidate = await getCandidateById(id)
    const centers = await getCenters()
    const signs = await getSigns()

    if (!candidate) notFound()

    // Bind the ID to the action
    const updateAction = updateCandidateAction.bind(null, candidate.id)

    return (
        <div className="py-8">
            <CandidateForm
                initialData={candidate}
                centers={centers}
                signs={signs}
                action={updateAction}
                title="Edit Candidate"
                description={`Update details for ${candidate.name}.`}
            />
        </div>
    )
}