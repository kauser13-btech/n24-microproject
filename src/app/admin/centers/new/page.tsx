import { createCenterAction } from "@/lib/actions"
import { CenterForm } from "@/components/center-form"

export default function NewCenterPage() {
    return (
        <div className="py-8">
            <CenterForm
                action={createCenterAction}
                title="Add New Center"
                description="Register a new election center in the system."
            />
        </div>
    )
}
