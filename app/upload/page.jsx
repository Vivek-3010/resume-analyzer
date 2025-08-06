"use client"

import React, { useState } from "react"
import Navbar from "../dashboard/_components/Navbar"
import FileUploader from "./_components/FileUploader"
import { usePuterStore } from "@/lib/puter"
import { useRouter } from "next/navigation"
import { convertPdfToImage, generateUUID } from "./_components/pdfToImage"
import { prepareInstructions } from "../dashboard/_components/data"

function Page() {

  const {auth, isLoading, fs, ai, kv} = usePuterStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusText, setStatusText] = useState("")
  const [file, setFile] = useState(null)

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile)
  }

  const handleAnalyze = async ({companyName, jobTitle, jobDescription, file}) => {
    try {
      setIsProcessing(true)
      setStatusText("Analyzing your resume...");

      // Upload original PDF file
      console.log("Uploading PDF file...")
      const uploadedFile = await fs.upload([file]);

      if(!uploadedFile || !uploadedFile.path){
          throw new Error("Failed to upload PDF file");
      }
      
      console.log("PDF uploaded successfully:", uploadedFile.path)
      setStatusText("Converting PDF to image...");

      // Convert PDF to image
      console.log("Converting PDF to image...")
      const imageResult = await convertPdfToImage(file);

      if(!imageResult.file || imageResult.error){
          throw new Error(imageResult.error || "Failed to convert PDF to image");
      }

      console.log("PDF converted successfully")
      setStatusText("Uploading the image...")

      // Upload the converted image
      const uploadedImage = await fs.upload([imageResult.file]);

      if(!uploadedImage || !uploadedImage.path){
          throw new Error("Failed to upload converted image");
      }

      console.log("Image uploaded successfully:", uploadedImage.path)
      setStatusText("Preparing data...");

      // Generate UUID and prepare data
      const uuid = generateUUID();

      const data = {
          uuid,
          resumePath: uploadedFile.path,
          imagePath: uploadedImage.path,
          companyName, 
          jobTitle, 
          jobDescription,
          feedback: '',
      }

      // Save initial data
      await kv.set(`resume${uuid}`, JSON.stringify(data));
      console.log("Data saved with UUID:", uuid)
      
      setStatusText("Analyzing resume with AI...");

      // Get AI feedback
      const feedback = await ai.feedback(
          uploadedFile.path,
          prepareInstructions({jobTitle, jobDescription})
      )

      if(!feedback || !feedback.message){
          throw new Error("Failed to get AI feedback");
      }

      // Extract feedback text
      const feedbackText = typeof feedback.message.content === 'string' 
          ? feedback.message.content 
          : feedback.message.content[0]?.text

      if (!feedbackText) {
          throw new Error("No feedback content received from AI");
      }

      console.log("AI feedback received")

      // Parse and save feedback
      try {
          data.feedback = JSON.parse(feedbackText);
      } catch (parseError) {
          console.warn("Failed to parse feedback as JSON, saving as text:", parseError)
          data.feedback = feedbackText;
      }

      await kv.set(`resume${uuid}`, JSON.stringify(data));
      
      setStatusText("Analysis completed! Redirecting...");
      console.log("Analysis completed successfully:", data);
      
      // Redirect to results page (you might want to implement this)
      router.push(`/resume/${uuid}`);
      
      // Reset form after successful completion
      setTimeout(() => {
          setIsProcessing(false);
          setStatusText("");
          setFile(null);
      }, 2000);

    } catch (error) {
      console.error("Analysis error:", error);
      setStatusText(`Error: ${error.message}`);
      setIsProcessing(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const form = e.currentTarget
    const formData = new FormData(form)
    const companyName = formData.get("company-name")
    const jobTitle = formData.get("job-title")
    const jobDescription = formData.get("job-description")

    // Validate required fields
    if (!companyName || !jobTitle || !jobDescription) {
        alert("Please fill in all required fields");
        return;
    }

    if(!file){
        alert("Please upload a resume file");
        return;
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
        alert("Please upload a PDF file");
        return;
    }

    console.log("Starting analysis with:", {
        companyName,
        jobTitle,
        jobDescription,
        fileName: file.name,
        fileSize: file.size
    });

    handleAnalyze({companyName, jobTitle, jobDescription, file});
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-200 to-blue-100 w-full pt-6">
      <Navbar />
      <section className="main-section">
        <div className="w-full max-w-xl mx-auto">
          <h1 className="text-center">Smart feedback for your dream job</h1>

          {isProcessing ? (
            <>
              <h2 className="text-center">{statusText}</h2>
              <img
                src="/images/resume-scan.gif"
                className="w-full block max-w-md mx-auto"
                alt="Scanning resume"
              />
            </>
          ) : (
            <h2 className="text-center my-5">
              Drop your resume for an ATS score and resume tips
            </h2>
          )}

          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className="compact-form mt-4"
            >
              <div className="form-div">
                <label htmlFor="company-name" className="mb-0">
                  Company name *
                </label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-title" className="mb-0">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="job-title"
                  placeholder="Enter job title"
                  required
                />
              </div>

              <div className="form-div">
                <label htmlFor="job-description" className="mb-0">
                  Job Description *
                </label>
                <textarea
                  rows={5}
                  name="job-description"
                  placeholder="Paste the job description here"
                  required
                />
              </div>

              <div className="form-div">
                <label htmlFor="uploader" className="mb-0">
                  Upload Resume *
                </label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button 
                className="primary-button" 
                type="submit"
                disabled={!file}
              >
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}

export default Page