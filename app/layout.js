import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import PuterInitializer from "./dashboard/_components/PuterInitializerWrapper"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "Resume Analyzer",
  description: "Smart feedback for your dream job",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script src="https://js.puter.com/v2/"></script>
        <PuterInitializer />
        {children}
      </body>
    </html>
  )
}
