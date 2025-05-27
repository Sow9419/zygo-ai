import Link from "next/link"
import Image from "next/image"
import { ChevronRight, TrendingUp, Star } from "lucide-react"

export function TrendingSection() {
  return (
    <div className="w-full h-auto bg-black/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-purple-400 mr-2" />
            <h2 className="text-white font-bold text-lg">Tendances</h2>
          </div>
          <Link href="/trending" className="text-white/80 hover:text-white flex items-center text-sm transition-colors">
            <span>Voir tout</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="flex overflow-auto pb-4 gap-4 scrollbar-hide">
          <TrendingItem
            image="/placeholder.svg?height=120&width=160"
            title="Smartphones pliables"
            category="Électronique"
            price="999 €"
            rating={4.8}
          />
          <TrendingItem
            image="/placeholder.svg?height=120&width=160"
            title="Services de livraison express"
            category="Services"
            price="Dès 4,99 €"
            rating={4.5}
          />
          <TrendingItem
            image="/placeholder.svg?height=120&width=160"
            title="Écouteurs sans fil premium"
            category="Audio"
            price="199 €"
            rating={4.9}
          />
          <TrendingItem
            image="/placeholder.svg?height=120&width=160"
            title="Montres connectées"
            category="Accessoires"
            price="249 €"
            rating={4.7}
          />
          <TrendingItem
            image="/placeholder.svg?height=120&width=160"
            title="Tablettes graphiques"
            category="Créativité"
            price="349 €"
            rating={4.6}
          />
        </div>
      </div>
    </div>
  )
}

function TrendingItem({
  image,
  title,
  category,
  price,
  rating,
}: {
  image: string
  title: string
  category: string
  price: string
  rating: number
}) {
  return (
    <Link
      href={`/search?q=${encodeURIComponent(title)}`}
      className="flex flex-col min-w-[220px] bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-105 overflow-hidden"
    >
      <div className="relative h-[120px] w-full flex-shrink-0">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center">
          <Star className="h-3 w-3 text-yellow-400 mr-1 fill-yellow-400" />
          <span>{rating}</span>
        </div>
      </div>
      <div className="p-3 text-white">
        <div className="text-sm font-medium line-clamp-1">{title}</div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-white/70">{category}</span>
          <span className="text-xs font-bold text-purple-300">{price}</span>
        </div>
      </div>
    </Link>
  )
}