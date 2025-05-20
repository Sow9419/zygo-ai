"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { TrendingSection } from "@/components/search/trending-section"
import { BackgroundSlider } from "@/components/media/background-slider"
import { useRouter } from "next/navigation"

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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

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
  }, [isRecording])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("La reconnaissance vocale n'est pas prise en charge par votre navigateur.")
      return
    }

    setIsRecording(!isRecording)

    // @ts-expect-error - SpeechRecognition n'est pas encore dans les types TypeScript standards
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    recognition.lang = "fr-FR"
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: { results: { transcript: string }[][] }) => {
      const transcript = event.results[0][0].transcript
      setQuery(transcript)
      setIsRecording(false)

      // Soumettre automatiquement après une courte pause
      setTimeout(() => {
        router.push(`/search?q=${encodeURIComponent(transcript)}`)
      }, 500)
    }

    recognition.onerror = () => {
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognition.start()
  }

  const handleImageSearch = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Ici, vous pourriez implémenter une véritable recherche par image
      // Pour l'instant, nous simulons en ajoutant un texte prédéfini
      setQuery("Recherche par image similaire à " + file.name)

      // Réinitialiser l'input file pour permettre de sélectionner le même fichier à nouveau
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const clearSearch = () => {
    setQuery("")
  }
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    router.push(`/search?q=${encodeURIComponent(suggestion)}`)
    setShowSuggestions(false)
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Slider with animation effects */}
      <BackgroundSlider />

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
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        handleVoiceSearch={handleVoiceSearch}
        handleImageSearch={handleImageSearch}
        handleSearch={handleSearch}
        clearSearch={clearSearch}
        fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
        handleImageUpload={handleImageUpload}
        handleSuggestionClick={handleSuggestionClick}
      />

      {/* Trending Section */}
      <div className="relative z-20 mt-auto">
        <TrendingSection />
      </div>
    </div>
  )
}