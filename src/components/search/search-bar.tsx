"use client"

import React, { useContext } from "react"
import { X, Search, Mic, Camera } from "lucide-react"
import { LocationContext } from "@/contexts/location-context"
import { createSearchInput, InputType, createImageSearchInput } from "@/lib/searchs-ervice/search-input"
import { search } from "@/lib/searchs-ervice/search-service"

export interface SearchBarProps {
  query: string
  setQuery: (query: string) => void
  showSuggestions: boolean
  setShowSuggestions: (show: boolean) => void
  suggestionsRef: React.RefObject<HTMLDivElement>
  isRecording: boolean
  setIsRecording: (isRecording: boolean) => void
  router?: any // Pour la navigation
  handleVoiceSearch: () => void
  handleImageSearch: () => void
  handleSearch: (e: React.FormEvent) => void
  clearSearch: () => void
  fileInputRef: React.RefObject<HTMLInputElement>
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function SearchBar({
  query,
  setQuery,
  setShowSuggestions,
  isRecording,
  handleVoiceSearch,
  handleImageSearch,
  handleSearch,
  clearSearch,
  fileInputRef,
  handleImageUpload,
  router
}: SearchBarProps) {
  // Contexte de localisation
  const locationContext = useContext(LocationContext)
  const locationData = locationContext?.locationData || null
  
  // Fonction pour gérer la recherche avec notre nouveau service
  const handleSearchWithService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && router) {
      try {
        // Créer un objet SearchInput
        const searchInput = await createSearchInput(
          query.trim(),
          InputType.TEXT,
          locationData,
          null
        )

        // Effectuer la recherche via le service
        await search(searchInput)

        // Rediriger vers la page de résultats avec l'ID de requête
        router.push(`/search?q=${encodeURIComponent(query.trim())}&requestId=${searchInput.requestId}`)
      } catch (error) {
        console.error('Erreur lors de la recherche:', error)
        // Utiliser la fonction de recherche fournie en props en cas d'erreur
        handleSearch(e)
      }
    } else {
      // Utiliser la fonction de recherche fournie en props si pas de router
      handleSearch(e)
    }
  }
  return (
    <form onSubmit={router ? handleSearchWithService : handleSearch} className="w-full">
      <div className="relative w-full flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="w-full relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              if (e.target.value.length > 0) {
                setShowSuggestions(true)
              } else {
                setShowSuggestions(false)
              }
            }}
            onFocus={() => {
              if (query.length > 0) setShowSuggestions(true)
            }}
            onBlur={() => setShowSuggestions(false)}
            className="w-full h-16 pl-6 pr-36 rounded-full border-0 shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-base bg-white/90 backdrop-blur-sm text-black"
            placeholder="Rechercher des produits et services..."
            onInput={(e) => {
              // Si la valeur change via setQuery (par exemple via la voix), suggestions s'affichent
              if ((e.target as HTMLInputElement).value.length > 0) {
                setShowSuggestions(true)
              }
            }}
          />
        </div>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Effacer la recherche"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleImageSearch}
            className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
            aria-label="Recherche par image"
          >
            <Camera className="h-5 w-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
            aria-hidden="true"
          />

          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`p-2 transition-colors ${isRecording ? "text-red-500 animate-pulse" : "text-gray-400 hover:text-purple-600"}`}
            aria-label="Recherche vocale"
          >
            <Mic className="h-5 w-5" />
          </button>

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
            aria-label="Rechercher"
          >
            <Search className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </form>
  )
}