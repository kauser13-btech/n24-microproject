"use client"

import { useActionState } from "react"
import { updatePasswordAction } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProfilePage() {
    const [state, action, isPending] = useActionState((prev: any, formData: FormData) => updatePasswordAction(formData), null)

    return (
        <div className="max-w-xl mx-auto space-y-8">
            <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Profile Settings</h1>
                    <p className="text-slate-500 mt-1">Manage your account credentials and security.</p>
                </div>
            </div>

            <Card className="border-0 shadow-lg shadow-slate-200/40 bg-white">
                <CardHeader className="bg-indigo-50/50 border-b border-indigo-100/50 pb-4">
                    <CardTitle className="text-lg text-indigo-950 font-semibold">Change Password</CardTitle>
                    <CardDescription className="text-indigo-900/60">Ensure your account is secure with a strong password.</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <form action={action} className="space-y-5">
                        <div className="space-y-2">
                            <label htmlFor="currentPassword" className="text-sm font-semibold text-slate-700">Current Password</label>
                            <Input id="currentPassword" name="currentPassword" type="password" required className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label htmlFor="newPassword" className="text-sm font-semibold text-slate-700">New Password</label>
                            </div>
                            <Input id="newPassword" name="newPassword" type="password" required className="bg-slate-50 border-slate-200 focus:bg-white transition-colors" />
                        </div>

                        {state?.error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600 font-medium">
                                {state.error}
                            </div>
                        )}
                        {state?.success && (
                            <div className="p-3 rounded-lg bg-green-50 border border-green-100 text-sm text-green-600 font-medium">
                                {state.success}
                            </div>
                        )}

                        <div className="pt-2">
                            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 shadow-md shadow-indigo-200 active:shadow-sm transition-all" disabled={isPending}>
                                {isPending ? "Updating Password..." : "Update Password"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
