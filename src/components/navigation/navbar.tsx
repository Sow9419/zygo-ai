"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Menu, X, Heart, Clock, LogIn, Search, Mic, Camera, Trash2, ChevronRight } from "lucide-react"
import { SearchSuggestions } from "../search/search-suggestions"
import { useFavorites } from "@/contexts/favorites-context"

export function Navbar({ initialQuery = "" }: { initialQuery?: string }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [favoritesOpen, setFavoritesOpen] = useState(false)
  const [query, setQuery] = useState(initialQuery)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)
  const favoritesRef = useRef<HTMLDivElement>(null)
  const favBtnRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { favorites, removeFavorite } = useFavorites()

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
        favoritesRef.current &&
        favBtnRef.current &&
        !favoritesRef.current.contains(event.target as Node) &&
        !favBtnRef.current.contains(event.target as Node)
      ) {
        setFavoritesOpen(false)
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
        setFavoritesOpen(false)
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  // Empêcher le défilement du body quand le panneau des favoris est ouvert
  useEffect(() => {
    if (favoritesOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }

    return () => {
      document.body.style.overflow = ""
    }
  }, [favoritesOpen])

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
            <button
              ref={favBtnRef}
              onClick={() => setFavoritesOpen(!favoritesOpen)}
              className="relative p-2 text-gray-600 hover:text-purple-700 transition-colors bg-gray-100/80 hover:bg-gray-200/80 backdrop-blur-sm rounded-full"
              aria-label="Favoris"
              aria-expanded={favoritesOpen}
            >
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>

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

        {/* Menu mobile */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute top-full left-0 right-0 bg-white/90 backdrop-blur-md shadow-lg z-50 border-t border-gray-100/50 animate-in slide-in-from-top-5 duration-200"
          >
            <nav className="py-3 px-4 divide-y divide-gray-100">
              <div className="py-2">
                {/* Logo dans le menu mobile */}
                <div className="flex items-center mb-3 md:hidden">
                  <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
                    <div className="relative h-8 w-16">
                      <Image
                        src="/placeholder.svg?height=32&width=96"
                        alt="ZYGO Search"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="ml-1 font-bold text-xl text-purple-700">ZYGO</span>
                  </Link>
                </div>

                <nav className="flex flex-col md:hidden space-y-2">
                  <Link href="/favorites" className="flex items-center py-2 text-gray-700 hover:text-purple-700">
                    <Heart className="h-4 w-4 mr-1" />
                    <span>Favoris</span>
                  </Link>
                  <Link href="/history" className="flex items-center py-2 text-gray-700 hover:text-purple-700">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Historique</span>
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors w-fit"
                  >
                    <LogIn className="h-4 w-4 mr-1" />
                    <span>Connexion</span>
                  </Link>
                </nav>

                <button
                  className="flex items-center py-2 text-gray-700 hover:text-purple-700 w-full md:hidden"
                  onClick={() => {
                    setMenuOpen(false)
                    setFavoritesOpen(true)
                  }}
                >
                  <Heart className="h-5 w-5 mr-3" />
                  <span>Mes favoris</span>
                  {favorites.length > 0 && (
                    <span className="ml-2 bg-purple-100 text-purple-700 text-xs rounded-full px-2 py-0.5">
                      {favorites.length}
                    </span>
                  )}
                </button>
              </div>

              <div className="py-2">
                <Link
                  href="/help"
                  className="flex items-center py-2 text-gray-700 hover:text-purple-700"
                  onClick={() => setMenuOpen(false)}
                >
                  <span>Aide et support</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center py-2 text-gray-700 hover:text-purple-700"
                  onClick={() => setMenuOpen(false)}
                >
                  <span>Paramètres</span>
                </Link>
              </div>

              {/* Menu pour écrans moyens et grands */}
              <div className="hidden md:block py-2">
                <nav className="flex items-center space-x-6">
                  <Link
                    href="/favorites"
                    className="text-gray-700 hover:text-purple-700 transition-colors flex items-center"
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    <span>Favoris</span>
                  </Link>
                  <Link
                    href="/history"
                    className="text-gray-700 hover:text-purple-700 transition-colors flex items-center"
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Historique</span>
                  </Link>
                  <Link
                    href="/login"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full transition-colors flex items-center"
                  >
                    <LogIn className="h-4 w-4 mr-1" />
                    <span>Connexion</span>
                  </Link>
                </nav>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Panneau latéral des favoris */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-md z-50 transition-opacity duration-300 ${
          favoritesOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!favoritesOpen}
      >
        <div
          ref={favoritesRef}
          className={`absolute top-0 right-0 h-full w-full sm:w-96 bg-white/95 backdrop-blur-md shadow-xl transition-transform duration-300 ease-in-out ${
            favoritesOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold flex items-center">
                <Heart className="h-5 w-5 text-purple-600 mr-2" />
                Mes favoris
                {favorites.length > 0 && (
                  <span className="ml-2 bg-purple-100 text-purple-700 text-xs rounded-full px-2 py-0.5">
                    {favorites.length}
                  </span>
                )}
              </h2>
              <button
                onClick={() => setFavoritesOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                aria-label="Fermer les favoris"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {favorites.length > 0 ? (
                <div className="space-y-4">
                  {favorites.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="relative h-16 w-16 bg-white rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="font-medium text-gray-800 group-hover:text-purple-700 transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex mt-1">
                          <Link
                            href={`/product/${item.id}`}
                            className="text-xs text-purple-600 hover:text-purple-800 transition-colors"
                          >
                            Voir le produit
                          </Link>
                          <button
                            className="text-xs text-red-500 hover:text-red-700 transition-colors ml-3 flex items-center"
                            onClick={() => removeFavorite(item.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Retirer
                          </button>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="bg-gray-100 p-6 rounded-full mb-4">
                    <Heart className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun favori</h3>
                  <p className="text-gray-500 mb-6">Vous n&apos;avez pas encore ajouté de produits à vos favoris.</p>
                  <Link
                    href="/"
                    className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
                    onClick={() => setFavoritesOpen(false)}
                  >
                    Découvrir des produits
                  </Link>
                </div>
              )}
            </div>

            {favorites.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button
                    className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    onClick={() => setFavoritesOpen(false)}
                  >
                    Continuer la recherche
                  </button>
                  <button
                    className="py-2 px-4 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors flex items-center"
                    onClick={() => {
                      // Supprimer tous les favoris un par un pour déclencher les notifications
                      ;[...favorites].forEach((fav) => removeFavorite(fav.id))
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Tout supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}