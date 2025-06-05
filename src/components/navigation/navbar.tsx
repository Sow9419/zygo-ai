"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
// useRouter is not directly used by navbar for search submission anymore, useSearchHandler handles navigation
import { Menu, X, Search, Mic, Camera } from "lucide-react"
import { MenuDropdown } from "./menu-dropdown"
import { SearchSuggestions } from "../search/search-suggestions"
// Contexts for UID and Location are used by useSearchHandler, not directly here.
// InputType and SearchType will be handled by useSearchHandler.
// search service is called by useSearchHandler.
import { useSearchHandler } from "@/hooks/use-search-handler"; // Import the new hook
import { type SpeechRecognitionEvent, type SpeechRecognition, type SpeechRecognitionConstructor } from "./navbar"; // Keep these local for voice input processing

// Corrected SpeechRecognition interfaces (ensure they are exported)
export interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

export interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
}

export interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

// Global declaration for window.SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

export function Navbar({ initialQuery = "" }: { initialQuery?: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState(initialQuery)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const menuRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { handleTextSearch, handleImageSearch, handleVoiceSearch: triggerVoiceSearch } = useSearchHandler(); // Use the hook

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 10); };
    
    // Ajouter l'écouteur d'événement de scroll
    window.addEventListener('scroll', handleScroll)
    
    // Nettoyer l'écouteur lors du démontage du composant
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  
  // Effet pour gérer les clics en dehors des menus et la touche Échap
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Fermer le menu si on clique en dehors
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }

      // Fermer les suggestions si on clique en dehors de l'input et des suggestions
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    // Gérer la touche Échap pour fermer les menus
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false)
        setShowSuggestions(false)
      }
    }

    // Ajouter les écouteurs d'événements
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    // Nettoyer les écouteurs lors du démontage
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleTextSearch(query.trim()); // Use hook method
      setShowSuggestions(false);
      // inputRef.current?.blur(); // Optionally blur input
    }
  };

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const onSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    handleTextSearch(suggestion); // Use hook method for suggestions too
    setShowSuggestions(false);
  };

  const onVoiceSearchClick = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("La reconnaissance vocale n'est pas prise en charge par votre navigateur.");
      return;
    }
    setIsRecording(true);
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setIsRecording(false); return;
    }
    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript); // Update query state
      setIsRecording(false);
      if (transcript.trim()) {
        triggerVoiceSearch(transcript.trim()); // Use hook method
      }
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  const onImageSearchClick = () => {
    fileInputRef.current?.click();
  };

  const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSearch(file); // Use hook method
      // Query will be updated by the context/redirect if necessary, or set by useSearchHandler logic
      setQuery(`Recherche par image: ${file.name}`); // Optimistic update for UI
    }
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/10 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-600 hover:text-purple-700 transition-colors bg-gray-100/80 hover:bg-gray-200/80 backdrop-blur-sm rounded-full" aria-label={menuOpen ? "Fermer menu" : "Ouvrir menu"} aria-expanded={menuOpen}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
          <div className="hidden md:flex items-center">
            <Link href="/" className="flex items-center mr-2">
              <div className="relative h-8 w-16"><Image src="/placeholder.svg?height=32&width=96" alt="ZYGO Search" fill className="object-contain" /></div>
              <span className="ml-1 font-bold text-xl text-purple-700 transition-colors">ZYGO</span>
            </Link>
          </div>
          <div className="flex-1 max-w-3xl mx-2">
            <form onSubmit={onSearchSubmit} className="w-full">
              <div className={`relative w-full flex items-center transition-all duration-300 ${isFocused ? "scale-105" : "scale-100"}`}>
                <div className={`absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full opacity-0 ${isFocused ? "animate-pulse opacity-20" : ""}`}></div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    // Afficher les suggestions si il y a du texte
                    if (e.target.value.length > 0) {
                      setShowSuggestions(true)
                    } else {
                      setShowSuggestions(false)
                    }
                  }}
                  onFocus={() => {
                    setIsFocused(true)
                    // Afficher les suggestions existantes lors du focus
                    if (query.length > 0) setShowSuggestions(true)
                  }}
                  onBlur={() => setIsFocused(false)}
                  className="w-full h-12 pl-5 pr-32 rounded-full border-0 shadow-md focus:outline-none focus:ring-2 focus:ring-white/60 text-base bg-white/60 backdrop-blur-md text-black transition-all duration-300"
                  placeholder="Rechercher des produits et services..."
                />

                {/* Conteneur des boutons d'action dans la barre de recherche */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  {/* Bouton pour effacer la recherche - visible seulement s'il y a du texte */}
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

                  {/* Bouton de recherche par image */}
                  <button
                    type="button"
                    onClick={handleImageSearch}
                    className={`p-1.5 text-black hover:text-purple-600 transition-colors ${isFocused ? "opacity-100" : "opacity-70"}`}
                    aria-label="Recherche par image"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  
                  {/* Input file caché pour la sélection d'images */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                    aria-hidden="true"
                  />

                  {/* Bouton de recherche vocale */}
                  <button
                    type="button"
                    onClick={handleVoiceSearch}
                    className={`p-1.5 transition-colors ${isRecording ? "text-red-500 animate-pulse" : "text-black hover:text-purple-600"} ${isFocused ? "opacity-100" : "opacity-70"}`}
                    aria-label="Recherche vocale"
                  >
                    <Mic className="h-4 w-4" />
                  </button>

                  {/* Bouton de soumission de la recherche */}
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

            {/* Suggestions de recherche - affichées conditionnellement */}
            {showSuggestions && (
              <div
                ref={suggestionsRef}
                className="absolute w-full max-w-3xl mt-2 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl z-50 overflow-hidden border border-purple-100 animate-in fade-in-50 duration-200"
              >
                <SearchSuggestions query={query} onSuggestionClick={handleSuggestionClick} />
              </div>
            )}
          </div>

          {/* Actions utilisateur - section droite */}
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

        {/* Menu dropdown - affiché conditionnellement */}
        {menuOpen && <MenuDropdown menuRef={menuRef} setMenuOpen={setMenuOpen} />}
      </div>
    </header>
  )
}