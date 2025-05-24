"use client"

import Link from "next/link"
import Image from "next/image"
import { Settings, LogOut, HelpCircle, Star } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { AuthDialog } from "@/components/auth"

interface MenuDropdownProps {
  menuRef: React.RefObject<HTMLDivElement | null> 
  setMenuOpen: (open: boolean) => void
}

export function MenuDropdown({ menuRef, setMenuOpen }: MenuDropdownProps) {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <div
      ref={menuRef}
      className="fixed right-4 top-16 w-64 bg-black/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden z-50 border animate-in slide-in-from-top-5 duration-200 "
    >
      <div className="py-2">
        {/* En-tête avec informations utilisateur */}
        <div className="px-4 py-3 flex items-center space-x-3">
          <div className="relative h-10 w-10 rounded-full overflow-hidden bg-purple-100">
            {isAuthenticated ? (
              <Image 
                src={user?.avatar || "/placeholder.svg?height=40&width=40"} 
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
            <div className="font-medium text-white/60">
              {isAuthenticated ? user?.name || "Utilisateur" : "Invité"}
            </div>
            <div className="text-xs text-white/60">
              {isAuthenticated ? user?.email : "Non connecté"}
            </div>
          </div>
        </div>

        {/* Paramètres */}
        <div className="bg-white/10 rounded-2xl ml-1 mr-1">
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
        {/* Connexion ou Déconnexion */}
        <div className="px-4 py-3">
          {isAuthenticated ? (
            <button
              className="flex items-center px-4 py-3 text-white hover:bg-white/15 transition-colors w-full"
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
            >
              <LogOut className="w-5 h-5 mr-3 text-white" />
              <span>Déconnexion</span>
            </button>
          ) : (
            <div onClick={() => setMenuOpen(false)}>
              <AuthDialog triggerClassName="flex items-center justify-center w-full bg-purple-600 hover:bg-purple-700 text-white py-1 px-4 rounded-lg transition-colors" />
            </div>
          )}
        </div>
        </div>
        {/* Visily logo */}
        <div className="px-4 py-3 text-center text-xs text-white">
          Made with <span className="text-purple-600">ZYGO AI</span>
        </div>
      </div>
    </div>
  )
}