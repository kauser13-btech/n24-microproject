"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import {
    createCenter, updateCenter, deleteCenter,
    createCandidate, updateCandidate, deleteCandidate,
    createSign, deleteSign,
    getUserByUsername, createUser, updateUser, deleteUser, getUsers, getUserById
} from "./db"
import { ElectionCenter, Candidate, Sign, User } from "./types"
import { signSession, verifySession } from "./session"
import { hashPassword, verifyPassword } from "./password"

// --- CENTERS ---
export async function createCenterAction(formData: FormData) {
    const name = formData.get("name") as string
    const area = formData.get("area") as string
    const seat_number = formData.get("seat_number") as string
    const district = formData.get("district") as string
    const division = formData.get("division") as string
    const total_voter = Number(formData.get("total_voter"))
    const male_voter = Number(formData.get("male_voter"))
    const female_voter = Number(formData.get("female_voter"))

    await createCenter({
        name,
        area,
        seat_number,
        district,
        division,
        total_voter,
        male_voter,
        female_voter
    })

    revalidatePath("/admin/centers")
    revalidatePath("/")
    redirect("/admin/centers")
}

export async function updateCenterAction(id: string, formData: FormData) {
    const name = formData.get("name") as string
    const area = formData.get("area") as string
    const seat_number = formData.get("seat_number") as string
    const district = formData.get("district") as string
    const division = formData.get("division") as string
    const total_voter = Number(formData.get("total_voter"))
    const male_voter = Number(formData.get("male_voter"))
    const female_voter = Number(formData.get("female_voter"))
    await updateCenter(id, {
        name,
        area,
        seat_number,
        district,
        division,
        total_voter,
        male_voter,
        female_voter
    })

    revalidatePath("/admin/centers")
    revalidatePath("/")
    revalidatePath(`/centers/${id}`)
    redirect("/admin/centers")
}

export async function deleteCenterAction(id: string) {
    await deleteCenter(id)
    revalidatePath("/admin/centers")
    revalidatePath("/")
}


// --- HELPER FOR FILE UPLOAD ---
import { writeFile } from "fs/promises"
import path from "path"

async function saveFile(file: File, folder: string): Promise<string> {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const filename = `${crypto.randomUUID()}-${file.name}`
    const publicPath = path.join(process.cwd(), "public", folder)
    const filePath = path.join(publicPath, filename)

    await writeFile(filePath, buffer)
    return `/${folder}/${filename}`
}

// --- CANDIDATES ---
export async function createCandidateAction(formData: FormData) {
    const name = formData.get("name") as string
    const party = formData.get("party") as string
    const assignedCenterId = formData.get("assignedCenterId") as string
    const signId = formData.get("signId") as string | null

    // Check if a file was uploaded or a URL was provided
    let photoUrl = formData.get("photoUrl") as string
    const photoFile = formData.get("photoFile") as File

    if (photoFile && photoFile.size > 0 && photoFile.name !== "undefined") {
        photoUrl = await saveFile(photoFile, "candidate")
    }

    if (!photoUrl) {
        photoUrl = "https://ui-avatars.com/api/?name=" + name
    }

    await createCandidate({
        name,
        party,
        photoUrl,
        assignedCenterId,
        signId: signId || undefined
    })

    revalidatePath("/admin/candidates")
    revalidatePath(`/centers/${assignedCenterId}`)
    redirect("/admin/candidates")
}

export async function updateCandidateAction(id: string, formData: FormData) {
    const name = formData.get("name") as string
    const party = formData.get("party") as string
    const assignedCenterId = formData.get("assignedCenterId") as string
    const signId = formData.get("signId") as string | null

    let photoUrl = formData.get("photoUrl") as string
    const photoFile = formData.get("photoFile") as File

    if (photoFile && photoFile.size > 0 && photoFile.name !== "undefined") {
        photoUrl = await saveFile(photoFile, "candidate")
    }

    await updateCandidate(id, {
        name,
        party,
        assignedCenterId,
        signId: signId || undefined,
        photoUrl: photoUrl || undefined
    })

    revalidatePath("/admin/candidates")
    revalidatePath(`/centers/${assignedCenterId}`)
    redirect("/admin/candidates")
}

export async function deleteCandidateAction(id: string) {
    await deleteCandidate(id)
    revalidatePath("/admin/candidates")
}

// --- SIGNS ---
export async function createSignAction(formData: FormData) {
    const name = formData.get("name") as string
    let imageUrl = formData.get("imageUrl") as string
    const imageFile = formData.get("imageFile") as File

    if (imageFile && imageFile.size > 0 && imageFile.name !== "undefined") {
        imageUrl = await saveFile(imageFile, "signs")
    }

    await createSign({
        name,
        imageUrl
    })

    revalidatePath("/admin/signs")
    redirect("/admin/signs")
}

export async function deleteSignAction(id: string) {
    await deleteSign(id)
    revalidatePath("/admin/signs")
}

// --- AUTH ---
export async function loginAction(state: any, formData: FormData) {
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    const user = await getUserByUsername(username)
    if (!user) {
        return { error: "Invalid username or password" }
    }

    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
        return { error: "Invalid username or password" }
    }

    const sessionToken = await signSession({ userId: user.id, role: user.role })

    console.log("Login successful, setting cookie for user:", user.username)

    // Await the cookies() call
    const cookieStore = await cookies()
    cookieStore.set("session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    console.log("Cookie set, redirecting to /admin")
    redirect("/admin")
}

export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete("session")
    redirect("/login")
}

export async function updatePasswordAction(formData: FormData) {
    const currentPassword = formData.get("currentPassword") as string
    const newPassword = formData.get("newPassword") as string

    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("session")?.value
    if (!sessionToken) redirect("/login")

    const session = await verifySession(sessionToken)
    if (!session) redirect("/login")

    const user = await getUserById(session.userId)
    if (!user) redirect("/login")

    const isValid = await verifyPassword(currentPassword, user.passwordHash)
    if (!isValid) {
        return { error: "Incorrect current password" }
    }

    const newHash = await hashPassword(newPassword)
    await updateUser(user.id, { passwordHash: newHash })

    revalidatePath("/admin/profile")
    return { success: "Password updated successfully" }
}

export async function createUserAction(formData: FormData) {
    const username = formData.get("username") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as "superadmin" | "admin"

    try {
        const passwordHash = await hashPassword(password)
        await createUser({
            username,
            passwordHash,
            role
        })
        revalidatePath("/admin/users")
        return { success: true }
    } catch (e: any) {
        return { error: e.message }
    }
}

export async function deleteUserAction(id: string) {
    await deleteUser(id)
    revalidatePath("/admin/users")
}

export async function resetUserPasswordAction(id: string) {
    // Reset to default "Dhaka@2025" for example, or generated
    const defaultPass = "Dhaka@2025"
    const hash = await hashPassword(defaultPass)
    await updateUser(id, { passwordHash: hash })
    revalidatePath("/admin/users")
    return { message: `Password reset to ${defaultPass}` }
}
