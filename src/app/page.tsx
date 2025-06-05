"use client"

import type React from "react"
import { type SpeechRecognitionEvent } from "@/components/navigation/navbar" // Assuming SpeechRecognitionEvent is exported from navbar.tsx, if not, adjust the import path or define it locally.

import { useState, useEffect, useRef } from "react"
import { TrendingSection } from "@/components/search/trending-section"
import { BackgroundSlider } from "@/components/media/background-slider"
// LocationContext and SearchInput/ImageSearchInput are handled by useSearchHandler
// search service is called by useSearchHandler
import { useSearchHandler } from "@/hooks/use-search-handler"; // Import the new hook
// Composants refactorisés
import { Header } from "@/components/navigation/header"
import { MainContent } from "@/components/search/main-content"
import { TimeDisplay } from "@/components/media/time-display"
import { LocationBadge } from "@/components/location/location-badge"

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [applicationOpen, setApplicationOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const applicationRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null); // For MainContent's image search
  const suggestionsRef = useRef<HTMLDivElement>(null); // For MainContent's suggestions

  const { handleTextSearch, handleImageSearch, handleVoiceSearch: triggerVoiceSearch } = useSearchHandler();

  // Fermer le menu et les suggestions quand on clique en dehors ou appuie sur Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false)
      }

      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false)
        setShowSuggestions(false)
        if (isRecording) {
          setIsRecording(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isRecording]);

  // Define handlers to be passed to MainContent
  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleTextSearch(query.trim());
      // setShowSuggestions(false); // MainContent might handle this
    }
  };

  const onVoiceSearch = () => { // Renamed to avoid conflict if passed directly
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("La reconnaissance vocale n'est pas prise en charge.");
      return;
    }
    setIsRecording(true);
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) { setIsRecording(false); return; }
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "fr-FR"
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript); // Update local query state for display in input
      setIsRecording(false);
      if (transcript.trim()) {
        triggerVoiceSearch(transcript.trim()); // Call hook's voice search
      }
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSearch(file);
      setQuery(`Recherche par image: ${file.name}`); // Optimistic UI update
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onImageSearchClick = () => { // Corrected: removed underscore from function name
    fileInputRef.current?.click()
  }

  const onClearSearch = () => {
    setQuery("");
    // Potentially focus input in MainContent, requires passing ref or callback
  };

  const onSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleTextSearch(suggestion); // Use hook for suggestion click
    setShowSuggestions(false);
  };


  return (
    <div className="min-h-screen flex flex-col relative overflow-auto scrollbar-hide">
       {/* Background fixe - ne bouge pas avec le scroll */}
       <div className="fixed inset-0 z-0">
        <BackgroundSlider />
      </div>

      {/* Header refactorisé */}
      <Header 
        menuOpen={menuOpen} 
        setMenuOpen={setMenuOpen} 
        menuRef={menuRef as React.RefObject<HTMLDivElement>}
        buttonRef={buttonRef as React.RefObject<HTMLButtonElement>}
        applicationOpen={applicationOpen}
        setApplicationOpen={setApplicationOpen}
        applicationRef={applicationRef as React.RefObject<HTMLDivElement>}
      />
      {/* Location and Time display - positioned below header, above title */}
      <div className="w-full mb-8 mt-20 pr-2">
        {/* Mobile layout - Les deux composants empilés verticalement à droite */}
        <div className="md:hidden flex justify-end">
          <div className="flex flex-col items-end gap-3">
            <TimeDisplay />
            <LocationBadge />
          </div>
        </div>

        {/* Desktop layout - Les deux composants empilés verticalement à droite */}
        <div className="hidden md:flex justify-end">
          <div className="flex flex-col items-end gap-3">
            <TimeDisplay />
            <LocationBadge />
          </div>
        </div>
      </div>

      {/* Main Content refactorisé */}
      <MainContent 
        query={query}
        setQuery={setQuery}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        suggestionsRef={suggestionsRef as React.RefObject<HTMLDivElement>}
        isRecording={isRecording} //setIsRecording={setIsRecording} // setIsRecording is local to page.tsx
        handleVoiceSearch={onVoiceSearch} // Pass the page's voice handler
        handleImageSearch={onImageSearchClick} // Pass the page's image click handler
        handleSearch={onSearchSubmit}
        clearSearch={onClearSearch}
        fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
        handleImageUpload={onImageUpload} // Pass the page's image upload handler
        handleSuggestionClick={onSuggestionClick}
      />

      {/* Trending Section */}
        <div className="pt-4">
        <TrendingSection />
        </div>
    </div>
  )
}