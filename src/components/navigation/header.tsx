"use client"

import Image from "next/image"
import Link from "next/link"
import { AlignRight, X, LogIn, Grip } from "lucide-react"
import { TimeDisplay } from "@/components/media/time-display"
import { LocationBadge } from "@/components/location/location-badge"
import { MenuDropdown } from "@/components/navigation/menu-dropdown"
import ApplicationGallery from "./application-galery"
import { useState, useEffect } from "react"
interface HeaderProps {
  menuOpen: boolean
  setMenuOpen: (open: boolean) => void
  menuRef: React.RefObject<HTMLDivElement>
  buttonRef: React.RefObject<HTMLButtonElement>
  applicationRef: React.RefObject<HTMLDivElement>
  setApplicationOpen: (open: boolean) => void
  applicationOpen: boolean
}

export function Header({ menuOpen, setMenuOpen, menuRef, buttonRef, applicationRef, setApplicationOpen, applicationOpen }: HeaderProps) {
  // État pour gérer le montage du composant (pour éviter les erreurs d'hydratation)
  const [isMounted, setIsMounted] = useState(false);
  
  // Effet pour marquer le composant comme monté après le rendu initial
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <header className="relative z-30 flex flex-col p-3 bg-gradient-to-b from-black/60 to-transparent">
      {/* Top navigation */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="flex items-center">
            <Link href="/" className="relative h-8 w-28 mr-2">
              <Image src="/placeholder.svg?height=32&width=112" alt="ZYGO Search" fill className="object-contain" />
            </Link>
            {/* button galerie application */}
            <div className="relative">
              <button
                className="text-white p-2 rounded-full hover:bg-white/30 transition-colors bg-black/20"
                onClick={() => setApplicationOpen(!applicationOpen)}
                aria-expanded={applicationOpen}
                aria-label="Galerie d'applications"
              >
                {applicationOpen ? <X className="h-6 w-6" /> : <Grip className="h-6 w-6" />}
              </button>
              {isMounted && applicationOpen && <ApplicationGallery applicationRef={applicationRef} setApplicationOpen={setApplicationOpen} />}
            </div>
          </div>
          
        </div>

        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/login"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full transition-colors flex items-center"
            >
              <LogIn className="h-4 w-4 mr-1" />
              <span>Connexion</span>
            </Link>
          </nav>
          
          {/* Menu burger pour les écrans plus petits */}
          <div className="relative">
            {/* Bouton pour ouvrir/fermer le menu */}
            <button
              ref={buttonRef}
              className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Menu principal"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <AlignRight className="h-6 w-6" />}
            </button>

            {menuOpen && <MenuDropdown menuRef={menuRef} setMenuOpen={setMenuOpen} />}
          </div>
        </div>
      </div>

      {/* Location and Time display - positioned below header, above title */}
      <div className="w-full mb-8">
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
    </header>
  )
}