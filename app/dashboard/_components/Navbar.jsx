import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (
    <div className=''>
      <nav className="bg-white p-6 h-16 mt-1 rounded-3xl shadow-md max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/">
          <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-blue-500">
            RESUMIND
          </p>
        </Link>
        <Link href='/upload' className='bg-gradient-to-r from-purple-600 to-blue-600  p-3 font-bold text-white rounded-xl'>
            Upload Resume
        </Link>
      </nav>
    </div>
  )
}

export default Navbar
