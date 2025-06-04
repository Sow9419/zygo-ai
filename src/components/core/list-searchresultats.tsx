"use client"

import React from "react"
import Image from "next/image"
import { SearchResult } from "@/hooks/use-search"
import { Card, CardContent } from "@/components/ui/card"
import { Tag, MapPin, Star, Cloud, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ListProductCardProps {
  product: SearchResult
}

const ListProductCard: React.FC<ListProductCardProps> = ({ product }) => {
  // Gérer les erreurs de chargement d'image
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement
    target.src = `https://placehold.co/100x100/f0f0f0/333333?text=${encodeURIComponent(product.category || 'Produit')}`
  }

  return (
    <Card className="w-full bg-white/90 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group">
      <div className="flex">
        {/* Image du produit */}
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 overflow-hidden">
          <Image
            src={product.image || `https://placehold.co/100x100/f0f0f0/333333?text=${encodeURIComponent(product.category || 'Produit')}`}
            alt={product.title}
            width={100}
            height={100}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleError}
          />
          <div className="absolute top-1 left-1">
            <span className="px-1.5 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-medium text-gray-700 flex items-center">
              <Tag className="w-2 h-2 mr-0.5" />
              {product.category}
            </span>
          </div>
        </div>

        {/* Informations du produit */}
        <CardContent className="flex-1 p-3">
          <div className="flex flex-col h-full justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-base font-semibold text-gray-900 leading-tight">{product.title}</h3>
                <div className="flex items-center gap-0.5 text-yellow-400 flex-shrink-0 bg-yellow-50 px-1.5 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs font-medium text-gray-700">{product.rating || '4.5'}</span>
                </div>
              </div>
              
              <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
              
              <div className="mt-1 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <Cloud className="w-3 h-3" />
                    <span>{product.type}</span>
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>À proximité</span>
                  </p>
                </div>
                
                <div className="text-base font-bold text-gray-900">{product.price || 'N/A'}</div>
              </div>
            </div>
            
            <div className="flex justify-end mt-2">
              <Button
                size="sm"
                aria-label="Voir le produit"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full h-7 px-3 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 text-xs"
              >
                Voir <ArrowUpRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

interface ListSearchResultatsProps {
  results: SearchResult[]
}

const ListSearchResultats: React.FC<ListSearchResultatsProps> = ({ results }) => {
  if (!results || results.length === 0) {
    return <p className="text-center text-gray-500">Aucun produit à afficher.</p>
  }

  return (
    <div className="p-3 md:p-6 min-h-screen">
      <div className="flex flex-col space-y-3">
        {results.map((product) => (
          <ListProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default ListSearchResultats