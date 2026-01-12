'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'

export function useAuth(redirectTo = '/login') {
    const router = useRouter()

    useEffect(() => {
        const token = authService.getAccessToken()

        if (!token) {
            router.push(redirectTo)
        }
    }, [router, redirectTo])

    return {
        isAuthenticated: !!authService.getAccessToken(),
        logout: () => {
            authService.logout()
            router.push('/login')
        }
    }
}