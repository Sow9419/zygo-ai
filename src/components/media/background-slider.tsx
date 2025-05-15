"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

// Images réelles de nature pour le slider
const backgrounds = [
  {
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop",
    alt: "Paysage montagneux avec lac et forêt",
  },
  {
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1974&auto=format&fit=crop",
    alt: "Coucher de soleil sur un paysage vallonné",
  },
  {
    src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1950&auto=format&fit=crop",
    alt: "Forêt brumeuse au lever du soleil",
  },
  {
    src: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=2070&auto=format&fit=crop",
    alt: "Lac entouré de montagnes et forêts",
  },
]

export function BackgroundSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)

  // Simplification du préchargement des images
  useEffect(() => {
    // Marquer les images comme chargées après un court délai
    // Cette approche évite les problèmes de préchargement tout en permettant
    // un temps minimal pour que les images commencent à se charger
    const timer = setTimeout(() => {
      setImagesLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Rotation des images
  useEffect(() => {
    if (!imagesLoaded) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % backgrounds.length)
        setIsTransitioning(false)
      }, 1000) // Match this with the CSS transition duration
    }, 8000) // Change image every 8 seconds

    return () => clearInterval(interval)
  }, [imagesLoaded])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Afficher un gradient pendant le chargement initial */}
      {!imagesLoaded && <div className="absolute inset-0 bg-gradient-to-b from-purple-900 to-black animate-pulse" />}

      {backgrounds.map((bg, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-110"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70 z-10" />
          <Image
            src={bg.src || "/placeholder.svg"}
            alt={bg.alt}
            fill
            priority={index === 0}
            className={`object-cover transition-transform duration-10000 ease-out ${
              index === currentIndex && !isTransitioning ? "scale-110" : "scale-100"
            }`}
            unoptimized // Désactive l'optimisation d'image pour éviter les problèmes avec les URLs externes
          />
        </div>
      ))}
    </div>
  )
}