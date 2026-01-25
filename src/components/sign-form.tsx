"use client"

import { useActionState } from "react"
import { createSignAction } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SignForm() {
    const [state, action, isPending] = useActionState((prev: any, formData: FormData) => createSignAction(formData), null)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Add New Sign</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={action} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">Sign Name</label>
                        <Input id="name" name="name" placeholder="e.g. Boat, Sheaf of Rice" required />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="imageUrl" className="text-sm font-medium">Image URL</label>
                        <Input id="imageUrl" name="imageUrl" placeholder="HTTPS URL to image" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="imageFile" className="text-sm font-medium">Or Upload Image</label>
                        <Input id="imageFile" name="imageFile" type="file" accept="image/*" />
                    </div>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Adding..." : "Add Sign"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
