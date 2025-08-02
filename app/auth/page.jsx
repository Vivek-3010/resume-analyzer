"use client"

import React, { useEffect } from 'react'
import { usePuterStore } from '@/lib/puter'
import { useSearchParams, useRouter } from 'next/navigation'

function Page() {
  const { isLoading, auth } = usePuterStore()
  const searchParams = useSearchParams()
  const router = useRouter()
  const next = searchParams?.get('next') 

  useEffect(() => {
    if (auth.isAuthenticated && next) {
      router.push(next)
    }
  }, [auth.isAuthenticated, next, router])

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 to-blue-100 w-full pt-6 flex items-center justify-center bg-cover">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-6 bg-white rounded-2xl p-8 max-w-md">
          <div className="flex flex-col gap-1 items-center text-center">
            <h1 className="text-xl font-semibold">Welcome</h1>
            <h2 className="text-sm text-gray-600">Log in to continue your job journey</h2>
          </div>
          <div className="flex justify-center">
            {isLoading ? (
              <button className="auth-button animate-pulse px-6 py-2 rounded-md bg-indigo-600 text-white">
                <p>Signing you in...</p>
              </button>
            ) : auth.isAuthenticated ? (
              <button
                className="auth-button px-6 py-2 rounded-md bg-red-500 text-white"
                onClick={auth.signOut}
              >
                <p>Log out</p>
              </button>
            ) : (
              <button
                className="auth-button px-6 py-2 rounded-md bg-green-600 text-white"
                onClick={auth.signIn}
              >
                <p>Login</p>
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Page
