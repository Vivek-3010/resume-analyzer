"use client"

import { useEffect } from "react"
import { usePuterStore } from "@/lib/puter"

export default function PuterInitializer() {
  const { init } = usePuterStore()

  useEffect(() => {
    init()
  }, [init])

  return null
}
