"use client"

import { usePuterStore } from '@/lib/puter';
import Link from 'next/link';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Summary from './_components/Summary';
import ATS from './_components/ATS';
import Details from './_components/Details';

function page() {

    const {auth, isLoading, fs, kv} = usePuterStore();
    const {id} = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState('');
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const next = searchParams?.get('next') || pathname || `resume/${id}`

    useEffect(()=>{
      const loadResume = async ()=>{
        const resume = await  kv.get(`resume${id}`);

        if(!resume){
          return;
        }

        const data = JSON.parse(resume);
        const resumeBlob = await fs.read(data.resumePath);
        if(!resumeBlob){
          return;
        } 

        const pdfBlob = new Blob([resumeBlob], {type : 'application/pdf'})
        const resumeUrl = URL.createObjectURL(pdfBlob);
        setResumeUrl(resumeUrl);
        
        const imageBlob = await fs.read(data.imagePath);
        console.log('Image Blob Type:', imageBlob.type);

        if(!imageBlob){
          return;
        }

        const imageUrl = URL.createObjectURL(imageBlob);
        setImageUrl(imageUrl);

        setFeedback(data.feedback);
        console.log({resumeUrl, imageUrl, feedback: data.feedback});
        
      }

      loadResume();
    }, [id]);

    useEffect(() => {
        // if authenticated, go to next (avoid looping back to auth)
        if (auth.isAuthenticated) {
          if (pathname !== next) {
            router.push(next)
          }
          return
        }
    
        // if not authenticated and not already on /auth, send to auth with next param
        if (!isLoading && !auth.isAuthenticated && !pathname.startsWith('/auth')) {
          router.push(`/auth?next=${encodeURIComponent(pathname)}`)
        }
      }, [isLoading, auth.isAuthenticated, next, router, pathname])

  return (
    <div>
      <nav className='resume-nav'>
        <Link href='/' className='back-button'>
          <img src="/icons/back.svg" alt="" className='w-2.5 h-2.5' />
          <span className='text-gray-800 text-sm font-semibold'>Back to homepage</span>
        </Link>
      </nav>

      <div className='flex flex-row w-full max-lg:flex-col-reverse'>
        <section className='feedback-section bg-url(/image/bg-small.svg) bg-cover '>
          {resumeUrl && (
            <div className='animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-w-xl:h-fit w-fit'>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Click to view full resume"
                className="relative group w-full h-full block"
              >
                <img
                  src="/images/resume-blur.jpg"
                  alt="Resume Preview"
                  className="w-full h-full object-contain rounded-2xl blur-sm transition-transform duration-300 group-hover:scale-[1.02]"
                />
                
                <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center transition duration-300 group-hover:bg-black/30">
                  <p className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded">
                    Click to view resume
                  </p>
                </div>
              </a>
            </div>
          )}
        </section>

        <section className="feedback-section">
          <h2 className='text-4xl font-bold !text-black'>Resume Review</h2>
          {feedback ? (
            <div className='flex flex-col gap-8 animate-in fade-in duration-1000'>
              <Summary feedback={feedback} />
              <ATS score={feedback.ATS.score} suggestions = {feedback.ATS.tips} />
              <Details feedback={feedback} />
            </div>
          ) : (
            <img src="/images/resume-scan-2.gif" alt="" className='w-full'/>
          )}
        </section>
      </div>
    </div>
  )
}

export default page
