// components/ResumeCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import ScoreCircle from './ScoreCircle'
import { usePuterStore } from '@/lib/puter'

function ResumeCard({ resume }) {

  const {auth, fs} = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState('');

  useEffect(()=>{
    const loadResume = async ()=>{
      const blob = await fs.read(resume.imagePath);
      if(!blob){
        return;
      }
      let url = URL.createObjectURL(blob);
      setResumeUrl(url);
    }

    loadResume();
  }, [resume.imagePath])

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
            <img src={resume.resumeUrl} alt="Resume preview" />

          </div>
        </div>
      </Link>
    </div>
  )
}

export default ResumeCard
