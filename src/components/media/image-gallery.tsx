"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, ExternalLink, ImageIcon } from "lucide-react"

interface GalleryImage {
  id: string
  src: string
  alt: string
  title: string
  url: string
}

// Fonction pour générer des images en fonction de la recherche
function getRelatedImages(query: string): GalleryImage[] {
  if (!query) return []

  // Images de base pour différentes catégories
  const baseImages: Record<string, GalleryImage[]> = {
    smartphone: [
      {
        id: "s1",
        src: "/placeholder.svg?height=200&width=200",
        alt: "Smartphone premium",
        title: "Smartphone premium",
        url: "#",
      },
      {
        id: "s2",
        src: "/placeholder.svg?height=200&width=200",
        alt: "Smartphone pliable",
        title: "Smartphone pliable",
        url: "#",
      },
      {
        id: "s3",
        src: "/placeholder.svg?height=200&width=200",
        alt: "Smartphone gaming",
        title: "Smartphone gaming",
        url: "#",
      },
      {
        id: "s4",
        src: "/placeholder.svg?height=200&width=200",
        alt: "Smartphone compact",
        title: "Smartphone compact",
        url: "#",
      },
      {
        id: "s5",
        src: "/placeholder.svg?height=200&width=200",
        alt: "Smartphone photo",
        title: "Smartphone photo",
        url: "#",
      },
      {
        id: "s6",
        src: "/placeholder.svg?height=200&width=200",
        alt: "Smartphone économique",
        title: "Smartphone économique",
        url: "#",
      },
    ],
    ordinateur: [
      {
        id: "o1",
        src: "/placeholder.svg?height=200&width=200",
        alt: "Ordinateur portable",
        title: "Ordinateur portable",
        url: "#",
      },
      {
        id: "o2",
        src: "/placeholder.svg?height=200&width=200",
        alt: "Ordinateur de bureau",
        title: "Ordinateur de bureau",
        url: "#",
      },
      {
        id: "o3",
        src: "/placeholder.svg?height=200&width=200",
        alt: "Ordinateur gaming",
        title: "Ordinateur gaming",
        url: "#",
      },
      {
        id: "o4",
        src: "/placeholder.svg?height=200&width=200",
        alt: "Ordinateur tout-en-un",
        title: "Ordinateur tout-en-un",
        url: "#",
      },
      {
        id: "o5",
        src: "/placeholder.svg?height=200&width=200",
        alt: "Ordinateur professionnel",
        title: "Ordinateur professionnel",
        url: "#",
      },
      { id: "o6", src: "/placeholder.svg?height=200&width=200", alt: "Mini PC", title: "Mini PC", url: "#" },
    ],
    service: [
      {
        id: "sv1",
        src: "/placeholder.svg?height=200&width=200",
        alt: "Service de réparation",
        title: "Service de réparation",
        url: "#",
      },
      {
        id: "sv2",
        src: "/placeholder.svg?height=200&width=200",
        alt: "Service de livraison",
        title: "Service de livraison",
        url: "#",
      },
      {
        id: "sv3",
        src: "/placeholder.svg?height=200&width=200",
        alt: "Service d'installation",
        title: "Service d'installation",
        url: "#",
      },
      {
        id: "sv4",
        src: "/placeholder.svg?height=200&width=200",
        alt: "Service de nettoyage",
        title: "Service de nettoyage",
        url: "#",
      },
      {
        id: "sv5",
        src: "/placeholder.svg?height=200&width=200",
        alt: "Service de conseil",
        title: "Service de conseil",
        url: "#",
      },
      {
        id: "sv6",
        src: "/placeholder.svg?height=200&width=200",
        alt: "Service de formation",
        title: "Service de formation",
        url: "#",
      },
    ],
    default: [
      {
        id: "d1",
        src: "/placeholder.svg?height=200&width=200",
        alt: "Produit populaire",
        title: "Produit populaire",
        url: "#",
      },
      {
        id: "d2",
        src: "/placeholder.svg?height=200&width=200",
        alt: "Service en tendance",
        title: "Service en tendance",
        url: "#",
      },
      { id: "d3", src: "/placeholder.svg?height=200&width=200", alt: "Nouveauté", title: "Nouveauté", url: "#" },
      {
        id: "d4",
        src: "/placeholder.svg?height=200&width=200",
        alt: "Meilleure vente",
        title: "Meilleure vente",
        url: "#",
      },
      { id: "d5", src: "/placeholder.svg?height=200&width=200", alt: "Promotion", title: "Promotion", url: "#" },
      { id: "d6", src: "/placeholder.svg?height=200&width=200", alt: "Exclusivité", title: "Exclusivité", url: "#" },
    ],
  }

  // Recherche dans les catégories
  const lowerQuery = query.toLowerCase()

  if (lowerQuery.includes("smartphone") || lowerQuery.includes("téléphone") || lowerQuery.includes("mobile")) {
    return baseImages.smartphone
  } else if (lowerQuery.includes("ordinateur") || lowerQuery.includes("pc") || lowerQuery.includes("laptop")) {
    return baseImages.ordinateur
  } else if (lowerQuery.includes("service") || lowerQuery.includes("réparation") || lowerQuery.includes("livraison")) {
    return baseImages.service
  }

  // Par défaut, retourner des images génériques
  return baseImages.default
}

export function ImageGallery({ query }: { query: string }) {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query) {
      setLoading(true)
      // Simuler un délai de chargement
      setTimeout(() => {
        setImages(getRelatedImages(query))
        setLoading(false)
      }, 300)
    } else {
      setImages([])
    }
  }, [query])

  if (!query) {
    return null
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-medium mb-4 flex items-center">
          <ImageIcon className="h-5 w-5 text-purple-500 mr-2" />
          Galerie d&apos;images
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 animate-pulse rounded-md"></div>
          ))}
        </div>
      </div>
    )
  }

  if (images.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-medium mb-4 flex items-center">
          <ImageIcon className="h-5 w-5 text-purple-500 mr-2" />
          Galerie d&apos;images
        </h2>
        <p className="text-gray-500 text-center py-8">Aucune image trouvée pour &quot;{query}&quot;</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium flex items-center">
          <ImageIcon className="h-5 w-5 text-purple-500 mr-2" />
          Galerie d&apos;images
        </h2>
        <Search className="h-5 w-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-3 gap-2">
        {images.map((image) => (
          <Link
            href={image.url}
            key={image.id}
            className="group relative aspect-square overflow-hidden rounded-md bg-gray-100"
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
              {image.title}
            </div>
            <div className="absolute top-2 right-2 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="h-3 w-3 text-gray-700" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 text-center">
        <Link
          href={`/images?q=${encodeURIComponent(query)}`}
          className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 transition-colors"
        >
          <span>Voir plus d&apos;images</span>
          <svg
            className="ml-1 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </div>
  )
}