"use client"
import Resultats from "@/components/core/main-resultat"
import { BackgroundSlider } from "@/components/media/background-slider"
import { Navbar } from "@/components/navigation/navbar"
import { FavoritesProvider } from "@/contexts/favorites-context"

export default function Search() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
    {/* Background Slider with animation effects */}
      <BackgroundSlider />
      {/* navbar wrapped with FavoritesProvider - fixed position with blur effect on scroll */}
      <FavoritesProvider>
        <Navbar />
      </FavoritesProvider>
      {/* Main content with adjusted padding to account for fixed navbar */}
      <div className="flex-1 pt-16">
        <Resultats />
      </div>
    </div>
  )
}