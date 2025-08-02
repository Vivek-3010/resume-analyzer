// app/page.tsx
"use client"

import React, { useEffect } from 'react'
import Navbar from './_components/Navbar'
import { resumes } from './_components/data'
import ResumeCard from './_components/ResumeCard'
import { usePuterStore } from '@/lib/puter'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

function Page() {
  const { auth } = usePuterStore()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const next = searchParams?.get('next') || pathname || '/'

  useEffect(() => {
    // if authenticated, go to next (avoid looping back to auth)
    if (auth.isAuthenticated) {
      if (pathname !== next) {
        router.push(next)
      }
      return
    }

    // if not authenticated and not already on /auth, send to auth with next param
    if (!auth.isAuthenticated && !pathname.startsWith('/auth')) {
      router.push(`/auth?next=${encodeURIComponent(pathname)}`)
    }
  }, [auth.isAuthenticated, next, router, pathname])

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 to-blue-100 w-full pt-6">
      <Navbar />
      <div className="main-section px-4 max-w-5xl mx-auto">
        <div className="page-heading text-center mb-4">
          <h1 className="text-xl font-semibold">
            Track Your Applications and Resume Ratings
          </h1>
          <h2 className="text-sm text-gray-700">
            Review your submissions and get AI-powered feedback
          </h2>
        </div>

        {resumes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
