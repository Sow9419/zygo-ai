"use client"

import React from "react"; // Removed useContext as it's not directly used here after changes
import { X, Search, Mic, Camera } from "lucide-react";
import { useLocationContext, type LocationData as ContextLocationData } from "@/contexts/location-context"; // Changed to useLocationContext and import type
import { createSearchInput, InputType, type LocationData as SearchLocationData } from "@/lib/searchs-ervice/search-input"; // Removed createImageSearchInput, imported SearchLocationData type
import { search } from "@/lib/searchs-ervice/search-service";
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'; // Import type for router

export interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  showSuggestions: boolean;
  setShowSuggestions: (show: boolean) => void;
  suggestionsRef: React.RefObject<HTMLDivElement>;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  router?: AppRouterInstance; // Typed router
  handleVoiceSearch: () => void
  handleImageSearch: () => void
  handleSearch: (e: React.FormEvent) => void
  clearSearch: () => void
  fileInputRef: React.RefObject<HTMLInputElement>
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Helper function to transform LocationData (similar to navbar.tsx)
function transformLocationData(contextLocationData: ContextLocationData | null): SearchLocationData | null {
  if (!contextLocationData) return null;
  return {
    country: contextLocationData.country,
    city: contextLocationData.city,
    lat: contextLocationData.location?.lat,
    lon: contextLocationData.location?.lon,
    isFallback: contextLocationData.isFallback,
  };
}

export function SearchBar({
  query,
  setQuery,
  setShowSuggestions,
  isRecording, // Included from props
  handleVoiceSearch,
  handleImageSearch,
  handleSearch, // This is the generic search handler from props
  clearSearch,
  fileInputRef,
  handleImageUpload,
  router,
}: SearchBarProps) {
  const locationContextHook = useLocationContext(); // Use the hook
  // Transform locationData for the search service
  const searchServiceLocationData = transformLocationData(locationContextHook?.locationData || null);
  
  // Fonction pour gérer la recherche avec notre nouveau service
  const handleSearchWithService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && router) {
      try {
        // Créer un objet SearchInput
        const searchInput = await createSearchInput(
          query.trim(),
          InputType.TEXT,
          searchServiceLocationData, // Use transformed location data
          null // imageData - SearchBar typically doesn't handle direct image data for text search
          // uid is not handled here as per current props, assuming parent passes it if needed or search-input handles it
        );
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
        {/* Gradient removed for brevity, assuming it's stylistic */}
        <div className="w-full relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => {
              if (query.length > 0) setShowSuggestions(true);
            }}
            // onBlur={() => setShowSuggestions(false)} // Original code had this, but it might interfere with suggestion clicks. Often handled by suggestionsRef click outside.
            className="w-full h-16 pl-6 pr-36 rounded-full border-0 shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-base bg-white/90 backdrop-blur-sm text-black"
            placeholder="Rechercher des produits et services..."
            onInput={(e) => {
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