"use client"

import { useActionState } from "react"
import { loginAction } from "@/lib/actions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
    // @ts-ignore - Types for useActionState might slightly differ in beta/rc, assuming standard signature
    const [state, formAction, isPending] = useActionState(loginAction, null)

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">

            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access the dashboard
                    </CardDescription>
                </CardHeader>
                <form action={formAction}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-medium">Username</label>
                            <Input id="username" name="username" placeholder="Enter username" required />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium">Password</label>
                            <Input id="password" name="password" type="password" placeholder="Enter password" required />
                        </div>
                        {state?.error && (
                            <div className="text-sm text-red-500 font-medium">
                                {state.error}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Logging in..." : "Login"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
