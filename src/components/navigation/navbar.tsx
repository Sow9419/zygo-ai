"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Menu, X, Search, Mic, Camera } from "lucide-react"
import { MenuDropdown } from "./menu-dropdown"
import { SearchSuggestions } from "../search/search-suggestions"

export function Navbar({ initialQuery = "" }: { initialQuery?: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState(initialQuery)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn] = useState(false) // State to manage if user is logged in

  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Détecter le défilement de la page
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      if (offset > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  // Fermer le menu quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }

      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false)
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, []);



  // Fonctions pour la barre de recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setShowSuggestions(false)
    }
  }

  const clearSearch = () => {
    setQuery("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    router.push(`/search?q=${encodeURIComponent(suggestion)}`)
    setShowSuggestions(false)
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

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/10 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Menu hamburger - visible uniquement sur mobile (à gauche) */}
          <div className="md:hidden">
            <button
              className="p-2 text-gray-600 hover:text-purple-700 transition-colors bg-gray-100/80 hover:bg-gray-200/80 backdrop-blur-sm rounded-full"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          {/* Logo - masqué sur mobile, visible sur desktop */}
          <div className="hidden md:flex items-center">
            <Link href="/" className="flex items-center mr-2">
              <div className="relative h-8 w-16">
                <Image src="/placeholder.svg?height=32&width=96" alt="ZYGO Search" fill className="object-contain" />
              </div>
              <span className="ml-1 font-bold text-xl text-purple-700 transition-colors">ZYGO</span>
            </Link>
          </div>

          {/* Barre de recherche intégrée - prend plus d'espace sur mobile */}
          <div className="flex-1 max-w-3xl mx-2">
            <form onSubmit={handleSearch} className="w-full">
              <div
                className={`relative w-full flex items-center transition-all duration-300 ${isFocused ? "scale-105" : "scale-100"}`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full opacity-0 ${isFocused ? "animate-pulse opacity-20" : ""}`}
                ></div>
                <input
                  ref={inputRef}
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
                    setIsFocused(true)
                    if (query.length > 0) setShowSuggestions(true)
                  }}
                  onBlur={() => setIsFocused(false)}
                  className="w-full h-12 pl-5 pr-32 rounded-full border-0 shadow-md focus:outline-none focus:ring-2 focus:ring-white/60 text-base bg-white/60 backdrop-blur-md text-black transition-all duration-300"
                  placeholder="Rechercher des produits et services..."
                />

                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  {query && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="p-1.5 text-black hover:text-gray-600 transition-colors"
                      aria-label="Effacer la recherche"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleImageSearch}
                    className={`p-1.5 text-black hover:text-purple-600 transition-colors ${isFocused ? "opacity-100" : "opacity-70"}`}
                    aria-label="Recherche par image"
                  >
                    <Camera className="h-4 w-4" />
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
                    className={`p-1.5 transition-colors ${isRecording ? "text-red-500 animate-pulse" : "text-black hover:text-purple-600"} ${isFocused ? "opacity-100" : "opacity-70"}`}
                    aria-label="Recherche vocale"
                  >
                    <Mic className="h-4 w-4" />
                  </button>

                  <button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
                    aria-label="Rechercher"
                  >
                    <Search className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </form>

            {/* Search Suggestions */}
            {showSuggestions && (
              <div
                ref={suggestionsRef}
                className="absolute w-full max-w-3xl mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl z-50 overflow-hidden border border-purple-100 animate-in fade-in-50 duration-200"
              >
                <SearchSuggestions query={query} onSuggestionClick={handleSuggestionClick} />
              </div>
            )}
          </div>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-1">
            {/* Menu hamburger - visible uniquement sur desktop (à droite) */}
            <button
              className="hidden md:block p-2 text-gray-600 hover:text-purple-700 transition-colors bg-gray-100/80 hover:bg-gray-200/80 backdrop-blur-sm rounded-full"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Menu dropdown */}
        {menuOpen && <MenuDropdown menuRef={menuRef} setMenuOpen={setMenuOpen} />}
      </div>
    </header>
  )
}