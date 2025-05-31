"use client"

import { useState, useEffect } from "react"
import { Search, TrendingUp, ArrowRight } from "lucide-react"
import { GeocodingResult } from "@/lib/localisation/location-service"
interface SearchSuggestionsProps {
  query: string
  onSuggestionClick: (suggestion: string) => void
}

// Mock function to generate product suggestions based on query
function generateSuggestions(query: string): string[] {
  if (!query) return []

  const baseProducts = [
    "smartphone",
    "ordinateur portable",
    "télévision",
    "montre connectée",
    "appareil photo",
    "enceinte bluetooth",
    "écouteurs sans fil",
    "tablette",
    "console de jeux",
    "aspirateur robot",
    "machine à café",
    "réfrigérateur",
    "lave-vaisselle",
    "micro-ondes",
    "climatiseur",
    "imprimante",
    "clavier",
    "souris",
    "moniteur",
    "disque dur",
    "routeur wifi",
    "caméra de surveillance",
  ]

  const baseServices = [
    "réparation",
    "installation",
    "livraison",
    "maintenance",
    "assurance",
    "abonnement",
    "consultation",
    "formation",
    "location",
    "personnalisation",
    "nettoyage",
    "conception",
    "développement",
    "marketing",
    "comptabilité",
  ]

  // Filter products and services that contain the query
  const matchingProducts = baseProducts.filter((p) => p.toLowerCase().includes(query.toLowerCase()))

  const matchingServices = baseServices.filter((s) => s.toLowerCase().includes(query.toLowerCase()))

  // Generate combinations
  const suggestions = [
    ...matchingProducts,
    ...matchingServices,
    ...matchingProducts.map((p) => `${p} pas cher`),
    // Localisation - Récupérer les données de localisation depuis localStorage
    ...(() => {
      try {
        const locationEnabled = localStorage.getItem("locationEnabled") === "true";
        if (locationEnabled) {
          // Tenter de récupérer les données de localisation
          const locationData = localStorage.getItem("locationData");
          if (locationData) {
            const { city, country } = JSON.parse(locationData);
            if (city && country) {
              return [
                ...matchingProducts.map((p) => `${p} à ${city}`),
                ...matchingProducts.map((p) => `${p} en ${country}`),
                ...matchingServices.map((s) => `${s} à ${city}`),
                ...matchingServices.map((s) => `${s} en ${country}`)
              ];
            }
          }
        }
        // Si la localisation n'est pas disponible, utiliser Paris, France par défaut
        return [
          ...matchingProducts.map((p) => `${p} à proximité`),
          ...matchingProducts.map((p) => `${p} dans la région`),
          ...matchingServices.map((s) => `${s} à Proximité`),
          ...matchingServices.map((s) => `${s} dans la région`)
        ];
      } catch (error) {
        console.error("Erreur lors de la récupération de la localisation:", error);
        return [];
      }
    })(),
    ...matchingProducts.map((p) => `meilleur ${p}`),
    ...matchingProducts.map((p) => `${p} professionnel`),
    ...matchingServices.map((s) => `service de ${s}`),
  ]

  // Sort by relevance (starting with query gets higher priority)
  suggestions.sort((a, b) => {
    const aStartsWithQuery = a.toLowerCase().startsWith(query.toLowerCase())
    const bStartsWithQuery = b.toLowerCase().startsWith(query.toLowerCase())

    if (aStartsWithQuery && !bStartsWithQuery) return -1
    if (!aStartsWithQuery && bStartsWithQuery) return 1
    return a.length - b.length
  })

  // Return unique suggestions, limited to 8
  return [...new Set(suggestions)].slice(0, 8)
}

export function SearchSuggestions({ query, onSuggestionClick }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length > 0) {
      setLoading(true)
      // Simulate API call delay
      const timer = setTimeout(() => {
        setSuggestions(generateSuggestions(query))
        setLoading(false)
      }, 200)

      return () => clearTimeout(timer)
    } else {
      setSuggestions([])
    }
  }, [query])

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Chargement des suggestions...</div>
  }

  if (suggestions.length === 0 && query.length > 0) {
    return <div className="p-4 text-center text-gray-500">Aucune suggestion trouvée</div>
  }

  return (
    <div className="py-2">
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {index < 2 ? (
            <TrendingUp className="h-4 w-4 text-gray-700 mr-3" />
          ) : (
            <Search className="h-4 w-4 text-gray-700 mr-3" />
          )}
          <span className="text-gray-700 font-medium">{suggestion}</span>
        </div>
      ))}

      <div className="border-t mt-2 pt-2">
        <div
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-gray-700 font-medium"
          onClick={() => onSuggestionClick(query)}
        >
          <ArrowRight className="h-4 w-4 mr-3" />
          <span>Rechercher &quot;{query}&quot;</span>
        </div>
      </div>
    </div>
  )
}