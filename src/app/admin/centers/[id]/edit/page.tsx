import { getCenterById } from "@/lib/db"
import { updateCenterAction } from "@/lib/actions"
import { CenterForm } from "@/components/center-form"
import { notFound } from "next/navigation"

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditCenterPage({ params }: PageProps) {
    const { id } = await params
    const center = await getCenterById(id)

    if (!center) notFound()

    // Bind the ID to the action
    const updateAction = updateCenterAction.bind(null, center.id)

    return (
        <div className="py-8">
            <CenterForm
                initialData={center}
                action={updateAction}
                title="Edit Center"
                description={`Update details for ${center.name}.`}
            />
        </div>
    )
}
