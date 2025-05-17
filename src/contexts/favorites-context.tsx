"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { Toast } from "@/components/core/toast"
export interface Product {
  id: string
  title: string
  description: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  category: string
  seller: string
  isSponsored?: boolean
  isFreeShipping?: boolean
  discount?: number
  location?: string
  distance?: string
  source?: string
}

interface FavoritesContextType {
  favorites: Product[]
  addFavorite: (product: Product) => void
  removeFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([])
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null)

  // Charger les favoris depuis le localStorage au démarrage
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("favorites")
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error)
    }
  }, [])

  // Sauvegarder les favoris dans le localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites))
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des favoris:", error)
    }
  }, [favorites])

  const addFavorite = (product: Product) => {
    if (!favorites.some((fav) => fav.id === product.id)) {
      setFavorites((prev) => [...prev, product])
      setToast({
        message: `"${product.title}" a été ajouté aux favoris`,
        type: "success",
      })
    }
  }

  const removeFavorite = (productId: string) => {
    const productToRemove = favorites.find((fav) => fav.id === productId)
    setFavorites((prev) => prev.filter((fav) => fav.id !== productId))
    if (productToRemove) {
      setToast({
        message: `"${productToRemove.title}" a été retiré des favoris`,
        type: "info",
      })
    }
  }

  const isFavorite = (productId: string) => {
    return favorites.some((fav) => fav.id === productId)
  }

  // Fermer le toast après un délai
  const closeToast = () => {
    setToast(null)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites doit être utilisé à l'intérieur d'un FavoritesProvider")
  }
  return context
}