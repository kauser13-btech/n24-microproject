"use client"

import { useActionState, useTransition } from "react"
import { createUserAction, resetUserPasswordAction, deleteUserAction } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, RefreshCw } from "lucide-react"

export function AddUserForm() {
    const [state, action, isPending] = useActionState(async (prev: any, formData: FormData) => {
        return await createUserAction(formData)
    }, null)

    return (
        <form action={action} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">Username</label>
                <Input id="username" name="username" required autoComplete="off" placeholder="newuser" />
            </div>
            <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input id="password" name="password" type="password" required autoComplete="new-password" placeholder="******" />
            </div>
            <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">Role</label>
                <select
                    name="role"
                    id="role"
                    className="flex h-10 w-full text-slate-200 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                    defaultValue="admin"
                >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                </select>
            </div>
            {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
            {state?.success && <p className="text-green-500 text-sm">User created successfully!</p>}

            <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Creating..." : "Create User"}
            </Button>
        </form>
    )
}

export function UserActions({ userId }: { userId: string }) {
    const [isPending, startTransition] = useTransition()

    const handleReset = () => {
        if (!confirm("Are you sure you want to reset this user's password?")) return

        startTransition(async () => {
            const result = await resetUserPasswordAction(userId)
            if (result?.message) {
                alert(result.message)
            }
        })
    }

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this user?")) return

        startTransition(async () => {
            await deleteUserAction(userId)
        })
    }

    return (
        <div className="flex gap-2 justify-end">
            <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={isPending}
            >
                <RefreshCw className="w-3 h-3 mr-1" />
                Reset Pass
            </Button>
            <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isPending}
            >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
            </Button>
        </div>
    )
}
