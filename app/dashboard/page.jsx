"use client"

import React, { useEffect, useState } from "react";
import Navbar from "./_components/Navbar";
import ResumeCard from "./_components/ResumeCard";
import { usePuterStore } from "@/lib/puter";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

function Page() {
  const { auth, kv } = usePuterStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const next = searchParams?.get("next") || pathname || "/";

  const [resumes, setResumes] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  // Handle authentication redirect
  useEffect(() => {
    if (auth.isAuthenticated) {
      if (pathname !== next) {
        router.push(next);
      }
      return;
    }

    if (!auth.isAuthenticated && !pathname.startsWith("/auth")) {
      router.push(`/auth?next=${encodeURIComponent(pathname)}`);
    }
  }, [auth.isAuthenticated, next, router, pathname]);

  // Load resumes from KV
  useEffect(() => {
    const loadResumes = async () => {
      try {
        const allKeys = await kv.list("*", true);
        console.log("All KV entries:", allKeys);

        const storedResumes = await kv.list("resume*", true);
        const parsedResumes =
          storedResumes?.map((resume) => JSON.parse(resume.value)) || [];
        setResumes(parsedResumes);
        console.log(parsedResumes);
        
      } catch (err) {
        console.error("Failed to load resumes:", err);
      } finally {
        setLoadingResumes(false);
      }
    };

    loadResumes();
  }, [kv]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 to-blue-100 w-full pt-6">
      <Navbar />
      <div className="px-4 max-w-5xl mx-auto flex flex-col items-center">
        <div className="page-heading text-center mb-4">
          <h1 className="text-xl font-semibold mt-5">
            Track Your Applications and Resume Ratings
          </h1>
          <h2 className="text-sm text-gray-700 mb-5">
            Review your submissions and get AI-powered feedback
          </h2>
        </div>

        {loadingResumes && <p className="text-gray-600">Loading resumes...</p>}

        {!loadingResumes && resumes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resumes.map((resume) => (
              <ResumeCard key={resume.uuid} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resumes.length === 0 && (
          <p className="text-gray-600">No resumes found.</p>
        )}
      </div>
    </div>
  );
}

export default Page;
