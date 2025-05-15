"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

export function TimeDisplay() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Format time as HH:MM
  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  // Format date as Day, DD Month YYYY
  const formattedDate = currentTime.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white/10 backdrop-blur-md rounded-full w-auto">
      <Clock className="w-4 h-4 text-purple-300 flex-shrink-0" />
      <div className="flex flex-col">
        <span className="text-white font-medium">{formattedTime}</span>
        <span className="text-xs text-gray-300 capitalize">{formattedDate}</span>
      </div>
    </div>
  )
}