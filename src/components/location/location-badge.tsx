"use client"

import { useState, useEffect } from "react"
import { MapPin, X, AlertTriangle } from "lucide-react"
import { useLocationContext } from "@/contexts/location-context"

interface LocationData {
  country: string
  city: string
  location?: {
    lat: number
    lon: number
  }
  isFallback?: boolean
}

export function LocationBadge() {
  const { locationData, setLocationData, isEnabled, setIsEnabled, isLoading, setIsLoading } = useLocationContext();
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isEnabled) {
      fetchLocation()
    } else {
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnabled])

  // Définir fetchLocation comme une fonction normale (pas const)
  async function fetchLocation() {
    setIsLoading(true)
    setError(null)
    try {
      const fallbackData = {
        country: "Localisation",
        city: "indisponible",
        location: { lat: 48.8566, lon: 2.3522 },
        isFallback: true,
      }
      try {
        const response = await fetch(`http://ip-api.com/json`)
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`)
        }
        const data = await response.json()
        if (data.error) throw new Error(data.error)
        setLocationData(data)
        localStorage.setItem("locationData", JSON.stringify(data))
      } catch (apiError) {
        setLocationData(fallbackData)
        localStorage.setItem("locationData", JSON.stringify(fallbackData))
      }
    } catch (err) {
      setError("Erreur lors de la récupération de la localisation")
    } finally {
      setIsLoading(false)
    }
  }

  function toggleLocation() {
    const newState = !isEnabled
    setIsEnabled(newState)
    localStorage.setItem("locationEnabled", newState.toString())
    if (newState) fetchLocation()
  }

  if (!isEnabled) {
    return (
      <button
        onClick={toggleLocation}
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 bg-black/60 backdrop-blur-md rounded-full hover:bg-black/70 transition-all min-w-[200px]"
      >
        <MapPin className="w-4 h-4" />
        <span>Activer la localisation</span>
      </button>
    )
  }

  return (
    <div className="relative flex items-center gap-2 px-4 py-2 text-sm bg-black/60 backdrop-blur-md rounded-full group min-w-[240px] max-w-[300px]">
      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-teal-500/20 flex-shrink-0">
        {locationData?.isFallback ? (
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        ) : (
          <MapPin className="w-4 h-4 text-teal-500" />
        )}
      </div>

      <div className="flex flex-col overflow-hidden">
        <span className="text-xs text-gray-300 whitespace-nowrap">Emplacement actuel</span>
        <span className="text-white font-medium truncate">
          {isLoading
            ? "Chargement..."
            : error
              ? error
              : locationData
                ? `${locationData.country}, ${locationData.city}`
                : "Localisation indisponible"}
        </span>
      </div>

      <button
        onClick={toggleLocation}
        className="absolute -right-1 -top-1 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Désactiver la localisation"
      >
        <X className="w-3 h-3 text-white" />
      </button>
    </div>
  )
}