import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySession } from './lib/session'

export async function middleware(request: NextRequest) {
    // Check if we are in the admin section
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const sessionCookie = request.cookies.get('session')

        console.log("Middleware checking /admin route. Cookie:", sessionCookie?.value ? "Found" : "Missing")

        if (!sessionCookie) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Verify session
        const session = await verifySession(sessionCookie.value)
        console.log("Session verification result:", session)
        if (!session) {
            // Invalid session
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Role verification for specific admin routes
        if (request.nextUrl.pathname.startsWith('/admin/users') && session.role !== 'superadmin') {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
    }

    // Redirect to admin if already logged in and visiting login
    if (request.nextUrl.pathname === '/login') {
        const sessionCookie = request.cookies.get('session')
        if (sessionCookie) {
            const session = await verifySession(sessionCookie.value)
            if (session) {
                return NextResponse.redirect(new URL('/admin', request.url))
            }
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/login'],
}
