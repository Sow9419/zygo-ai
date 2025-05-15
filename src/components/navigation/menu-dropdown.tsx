"use client"

import Link from "next/link"
import { Heart, Clock, Grid, Settings, LogIn } from "lucide-react"

interface MenuDropdownProps {
  menuRef: React.RefObject<HTMLDivElement>
  setMenuOpen: (open: boolean) => void
}

export function MenuDropdown({ menuRef, setMenuOpen }: MenuDropdownProps) {
  return (
    <div
      ref={menuRef}
      className="fixed right-4 top-16 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden z-50 border border-purple-100 animate-in slide-in-from-top-5 duration-200"
    >
      <div className="py-3">
        <div className="px-4 py-2 text-sm font-medium text-gray-500 uppercase">Menu</div>

        <Link
          href="/favorites"
          className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 transition-colors"
          onClick={() => setMenuOpen(false)}
        >
          <Heart className="w-5 h-5 mr-3 text-purple-600" />
          <span>Mes favoris</span>
        </Link>

        <Link
          href="/history"
          className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 transition-colors"
          onClick={() => setMenuOpen(false)}
        >
          <Clock className="w-5 h-5 mr-3 text-purple-600" />
          <span>Historique de recherche</span>
        </Link>

        <div className="border-t border-gray-100 my-2"></div>

        <div className="px-4 py-2 text-sm font-medium text-gray-500 uppercase">Explorer</div>

        <Link
          href="/categories"
          className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 transition-colors"
          onClick={() => setMenuOpen(false)}
        >
          <Grid className="w-5 h-5 mr-3 text-purple-600" />
          <span>Toutes les catégories</span>
        </Link>

        <Link
          href="/settings"
          className="flex items-center px-4 py-3 text-gray-700 hover:bg-purple-50 transition-colors"
          onClick={() => setMenuOpen(false)}
        >
          <Settings className="w-5 h-5 mr-3 text-purple-600" />
          <span>Paramètres</span>
        </Link>

        <div className="border-t border-gray-100 my-2"></div>

        <div className="px-4 py-3">
          <Link
            href="/login"
            className="flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <LogIn className="w-4 h-4 mr-2" />
            <span>Connexion</span>
          </Link>
        </div>
      </div>
    </div>
  )
}