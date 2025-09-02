"use client"

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface RouteGuardProps {
  children: React.ReactNode
}

export function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token')

      // If no token and trying to access dashboard
      if (!token && pathname.startsWith('/dashboard')) {
        router.push('/')
        return
      }

      // If token exists and on main page, redirect to appropriate dashboard
      if (token && pathname === '/') {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const role = payload.role

          if (role === 'admin') {
            router.push('/dashboard/admin')
          } else if (role === 'teacher') {
            router.push('/dashboard/teacher')
          }
          return
        } catch (error) {
          localStorage.removeItem('token')
          setIsAuthorized(true)
          setIsLoading(false)
          return
        }
      }

      // Role-based route protection for dashboard
      if (token && pathname.startsWith('/dashboard')) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const role = payload.role

          // Admin trying to access teacher routes
          if (role === 'admin' && pathname.startsWith('/dashboard/teacher')) {
            router.push('/dashboard/admin')
            return
          }

          // Teacher trying to access admin routes
          if (role === 'teacher' && pathname.startsWith('/dashboard/admin')) {
            router.push('/dashboard/teacher')
            return
          }

          setIsAuthorized(true)
        } catch (error) {
          localStorage.removeItem('token')
          router.push('/')
          return
        }
      } else {
        setIsAuthorized(true)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}