import { getUsers } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { AddUserForm, UserActions } from "@/components/user-management"

export default async function UsersPage() {
    const users = await getUsers()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Management</h1>
                    <p className="text-slate-500 mt-1">Manage system access, roles, and security.</p>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Card className="border-0 shadow-lg shadow-slate-200/40 overflow-hidden bg-white/80 backdrop-blur-sm">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-lg text-slate-900">System Users</CardTitle>
                            <CardDescription>List of all users with access to the admin panel.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow className="border-b border-slate-100 hover:bg-transparent">
                                        <TableHead className="font-semibold text-slate-500">Username</TableHead>
                                        <TableHead className="font-semibold text-slate-500">Role</TableHead>
                                        <TableHead className="font-semibold text-slate-500 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                            <TableCell className="font-medium text-slate-900 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold uppercase border border-slate-200">
                                                        {user.username.charAt(0)}
                                                    </div>
                                                    {user.username}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-4">
                                                <Badge
                                                    variant={user.role === 'superadmin' ? 'default' : 'secondary'}
                                                    className={user.role === 'superadmin'
                                                        ? "bg-indigo-600 hover:bg-indigo-700"
                                                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"}
                                                >
                                                    {user.role}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right py-4">
                                                {user.role !== 'superadmin' ? (
                                                    <UserActions userId={user.id} />
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-slate-50 text-slate-400 border border-slate-100">
                                                        Protected
                                                    </span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-8">
                        <Card className="border-0 shadow-lg shadow-slate-200/40 bg-white">
                            <CardHeader className="bg-indigo-50/50 border-b border-indigo-100/50">
                                <CardTitle className="text-lg text-indigo-950">Add New User</CardTitle>
                                <CardDescription className="text-indigo-900/60">Create a new admin account.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <AddUserForm />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
