// components/ResumeCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import ScoreCircle from './ScoreCircle'

function ResumeCard({ resume }) {
  return (
    <div className="mb-6">
      <Link
        href={`/resume/${resume.id}`}
        className="resume-card animate-in fade-in duration-1000 mx-4 block rounded-xl shadow-md bg-white overflow-hidden"
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-black font-bold break-words">{resume.companyName}</h2>
            <h3 className="text-lg text-gray-500 break-words">{resume.jobTitle}</h3>
          </div>
          <div className="flex-shrink-0">
            <ScoreCircle score={resume.feedback.overallScore} />
          </div>
        </div>

        <div className="gradient-border relative w-full">
          <div className="relative w-full aspect-[3/4] max-sm:aspect-[4/5]">
            <Image
              src={resume.imagePath}
              alt={`${resume.companyName} resume snapshot`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 640px) 100vw, 33vw"
              priority
            />
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ResumeCard
