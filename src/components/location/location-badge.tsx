"use client"

import { useState, useEffect } from "react"
import { MapPin, X, AlertTriangle } from "lucide-react"

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
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEnabled, setIsEnabled] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if location services are enabled in localStorage
    const storedPreference = localStorage.getItem("locationEnabled")
    if (storedPreference !== null) {
      setIsEnabled(storedPreference === "true")
    }

    // Only fetch if enabled
    if (isEnabled) {
      fetchLocation()
    } else {
      setIsLoading(false)
    }
  }, [isEnabled])

  const fetchLocation = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Utiliser des données de secours en cas d'échec de l'API
      const fallbackData: LocationData = {
        country: "Localisation",
        city: "indisponible",
        location: {
          lat: 48.8566,
          lon: 2.3522,
        },
        isFallback: true,
      }

      try {
        // Appel à notre route API proxy
        const response = await fetch(`http://ip-api.com/json`)
        console.log("-----> localisation data: " + response)
      


        if (!response.ok) {
          const errorText = await response.text()
          console.error("Erreur API:", errorText)
          throw new Error(`Erreur HTTP: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          throw new Error(data.error)
        }

        setLocationData(data)
      } catch (apiError) {
        console.warn("Utilisation des données de secours:", apiError)
        setLocationData(fallbackData)
      }
    } catch (err) {
      console.error("Location fetch error:", err)
      setError("Erreur lors de la récupération de la localisation")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleLocation = () => {
    const newState = !isEnabled
    setIsEnabled(newState)
    localStorage.setItem("locationEnabled", newState.toString())

    if (newState) {
      fetchLocation()
    }
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