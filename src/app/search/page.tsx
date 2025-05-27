"use client"
import Resultats from "@/components/core/main-resultat"
import { BackgroundSlider } from "@/components/media/background-slider"
import { Navbar } from "@/components/navigation/navbar"


export default function Search() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-auto scrollbar-hide">
    <div className="fixed inset-0 z-0">
        <BackgroundSlider />
      </div>
      {/* navbar - fixed position with blur effect on scroll */}
      <Navbar />
      {/* Main content with adjusted padding to account for fixed navbar */}
      <div className="flex-1 pt-16">
        <Resultats />
      </div>
    </div>
  )
}