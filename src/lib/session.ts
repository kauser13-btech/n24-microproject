import { SignJWT, jwtVerify } from 'jose'

const secretKey = process.env.AUTH_SECRET || 'dev-secret-key-change-this'
const key = new TextEncoder().encode(secretKey)

export async function signSession(payload: { userId: string; role: string }): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(key)
}

export async function verifySession(token: string): Promise<{ userId: string; role: string } | null> {
    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
        })
        return payload as { userId: string; role: string }
    } catch (error) {
        return null
    }
}
