import { createCandidateAction } from "@/lib/actions"
import { getCenters, getSigns } from "@/lib/db"
import { CandidateForm } from "@/components/candidate-form"

export default async function NewCandidatePage() {
    const centers = await getCenters()
    const signs = await getSigns()

    return (
        <div className="py-8">
            <CandidateForm
                centers={centers}
                signs={signs}
                action={createCandidateAction}
                title="Add New Candidate"
                description="Register a candidate and assign them to a center."
            />
        </div>
    )
}

