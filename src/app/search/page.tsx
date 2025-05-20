"use client"
import Resultats from "@/components/core/main-resultat"
import { BackgroundSlider } from "@/components/media/background-slider"
import { Navbar } from "@/components/navigation/navbar"


export default function Search() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
    {/* Background Slider with animation effects */}
      <BackgroundSlider />
      {/* navbar - fixed position with blur effect on scroll */}
      <Navbar />
      {/* Main content with adjusted padding to account for fixed navbar */}
      <div className="flex-1 pt-16">
        <Resultats />
      </div>
    </div>
  )
}