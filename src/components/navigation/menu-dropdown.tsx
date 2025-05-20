"use client"

import Link from "next/link"
import Image from "next/image"
import { Settings, LogOut, HelpCircle, Star } from "lucide-react"

interface MenuDropdownProps {
  menuRef: React.RefObject<HTMLDivElement | null> 
  setMenuOpen: (open: boolean) => void
  isLoggedIn?: boolean
}

export function MenuDropdown({ menuRef, setMenuOpen, isLoggedIn = false }: MenuDropdownProps) {
  return (
    <div
      ref={menuRef}
      className="fixed right-4 top-16 w-64 bg-white/50 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden z-50 border animate-in slide-in-from-top-5 duration-200"
    >
      <div className="py-2">
        {/* En-tête avec informations utilisateur */}
        <div className="px-4 py-3 flex items-center space-x-3">
          <div className="relative h-10 w-10 rounded-full overflow-hidden bg-purple-100">
            {isLoggedIn ? (
              <Image 
                src="/placeholder.svg?height=40&width=40" 
                alt="Photo de profil" 
                fill 
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-200">
                <span className="text-black text-xl">?</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium text-gray-800">
              {isLoggedIn ? "User name" : "Invité"}
            </div>
            <div className="text-xs text-gray-800">
              {isLoggedIn ? "example@gmail.com" : "Non connecté"}
            </div>
          </div>
        </div>

        {/* Paramètres */}
        <div className="bg-black/50 rounded-2xl ml-1 mr-1">
        <Link
          href="/settings"
          className="flex items-center px-4 py-3 text-white hover:bg-white/15 transition-colors"
          onClick={() => setMenuOpen(false)}
        >
          <Settings className="w-5 h-5 mr-3 text-white" />
          <span>Paramètre</span>
        </Link>
        <div className="border-t border-white/20"></div>

        {/* Go Pro */}
        <Link
          href="/pro"
          className="flex items-center px-4 py-3 text-white hover:bg-white/15 transition-colors"
          onClick={() => setMenuOpen(false)}
        >
          <Star className="w-5 h-5 mr-3 text-amber-300" />
          <span>Go Pro</span>
        </Link>
        
        <div className="border-t border-white/20"></div>
        {/* Centre d'aide */}
        <Link
          href="/help"
          className="flex items-center px-4 py-3 text-white hover:bg-white/15 transition-colors"
          onClick={() => setMenuOpen(false)}
        >
          <HelpCircle className="w-5 h-5 mr-3 text-white" />
          <span>Help center</span>
        </Link>
        </div>

          {/* Connexion ou Déconnexion */}
        <div className="px-4 py-3">
          {isLoggedIn ? (
            <Link
              href="/logout"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <LogOut className="w-5 h-5 mr-3 text-gray-600" />
              <span>Sign out</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-white py-1 px-4 rounded-lg transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <span>Connexion</span>
            </Link>
          )}
        </div>

        {/* Visily logo */}
        <div className="px-4 py-3 text-center text-xs text-black">
          Made with <span className="text-purple-600">ZYGO AI</span>
        </div>
      </div>
    </div>
  )
}