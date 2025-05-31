"use client"

import { Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { SearchBar } from "@/components/search/search-bar"
import { SearchSuggestions } from "@/components/search/search-suggestions"
import { CategoryButtons } from "@/components/search/category-buttons"
import { useState, useRef } from "react"

interface MainContentProps {
  query: string
  setQuery: (query: string) => void
  showSuggestions: boolean
  setShowSuggestions: (show: boolean) => void
  suggestionsRef: React.RefObject<HTMLDivElement>
  isRecording: boolean
  setIsRecording: (isRecording: boolean) => void
  handleVoiceSearch: () => void
  handleImageSearch: () => void
  handleSearch: (e: React.FormEvent) => void
  clearSearch: () => void
  fileInputRef: React.RefObject<HTMLInputElement>
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSuggestionClick: (suggestion: string) => void
}

export function MainContent({
  query,
  setQuery,
  showSuggestions,
  setShowSuggestions,
  suggestionsRef,
  isRecording,
  setIsRecording,
  handleImageSearch,
  handleSearch,
  clearSearch,
  fileInputRef,
  handleImageUpload,
  handleSuggestionClick
}: MainContentProps) {
  const router = useRouter()

  // Ajout de la fonction de recherche vocale qui ne fait que remplir l'input
  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("La reconnaissance vocale n'est pas prise en charge par votre navigateur.");
      return;
    }
    setIsRecording(true);
    // @ts-expect-error
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript); // Remplit juste l'input, pas d'envoi automatique
      setIsRecording(false);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  }

  return (
    <main className="flex-grow flex flex-col items-center justify-center z-20 px-4 mt-4 md:mt-0">
      <div className="w-full max-w-3xl text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
        Mieux qu’un moteur de recherche : un flair d’IA local
        </h1>
        <p className="text-white text-lg md:text-xl opacity-90 drop-shadow-md">
          Recherchez parmi des millions de produits et services de qualité
        </p>
      </div>

      <div className="w-full max-w-2xl">
        {/* Barre de recherche intégrée directement avec fonctionnalités vocale et image */}
        <SearchBar
          query={query}
          setQuery={setQuery}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          suggestionsRef={suggestionsRef}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          handleVoiceSearch={handleVoiceSearch}
          handleImageSearch={handleImageSearch}
          handleSearch={handleSearch}
          clearSearch={clearSearch}
          fileInputRef={fileInputRef}
          handleImageUpload={handleImageUpload}
        />

        {/* Search Suggestions */}
        {showSuggestions && query && (
          <div
            ref={suggestionsRef}
            className="absolute w-full max-w-2xl mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl z-50 overflow-hidden border border-purple-100 animate-in fade-in-50 duration-200"
          >
            <SearchSuggestions query={query} onSuggestionClick={handleSuggestionClick} />
          </div>
        )}

        {/* Annonce 2023*/}
        <div className="mt-3 text-center">
          <button
            className="inline-flex items-center text-white/80 hover:text-white text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors backdrop-blur-sm"
            onClick={() => {
              setQuery("Meilleurs produits technologiques 2023")
              setTimeout(() => {
                router.push(`/search?q=${encodeURIComponent("Meilleurs produits technologiques 2023")}`)
              }, 300)
            }}
          >
            <Sparkles className="h-3 w-3 mr-2 text-purple-300" />
            <span>Essayez  `Meilleurs produits technologiques 2023`</span>
          </button>
        </div>
      </div>

      <div className="mt-6 w-full max-w-3xl">
        <CategoryButtons setQuery={setQuery} />
      </div>
    </main>
  )
}