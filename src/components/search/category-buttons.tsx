import Link from "next/link"
import {
  Smartphone,
  Laptop,
  Tv,
  Headphones,
  Camera,
  ShoppingBag,
  Home,
  Car,
  Zap,
  Coffee,
  Shirt,
  Gift,
} from "lucide-react"

const categories = [
  { name: "Smartphones", icon: Smartphone, query: "smartphones", color: "from-blue-500 to-blue-600" },
  { name: "Ordinateurs", icon: Laptop, query: "ordinateurs portables", color: "from-purple-500 to-purple-600" },
  { name: "TV & Audio", icon: Tv, query: "télévisions audio", color: "from-green-500 to-green-600" },
  { name: "Accessoires", icon: Headphones, query: "accessoires électroniques", color: "from-yellow-500 to-yellow-600" },
  { name: "Photo", icon: Camera, query: "appareils photo", color: "from-red-500 to-red-600" },
  { name: "Mode", icon: Shirt, query: "vêtements chaussures", color: "from-pink-500 to-pink-600" },
  { name: "Maison", icon: Home, query: "meubles décoration", color: "from-indigo-500 to-indigo-600" },
  { name: "Auto", icon: Car, query: "accessoires auto", color: "from-orange-500 to-orange-600" },
  { name: "Électroménager", icon: Zap, query: "électroménager", color: "from-teal-500 to-teal-600" },
  { name: "Café & Thé", icon: Coffee, query: "café thé", color: "from-amber-500 to-amber-600" },
  { name: "Cadeaux", icon: Gift, query: "idées cadeaux", color: "from-rose-500 to-rose-600" },
  { name: "Tous", icon: ShoppingBag, query: "tous produits", color: "from-gray-500 to-gray-600" },
]

export function CategoryButtons() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {categories.map((category) => {
        const Icon = category.icon
        return (
          <Link
            key={category.name}
            href={`/search?q=${encodeURIComponent(category.query)}`}
            className="group flex flex-col items-center justify-center p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 backdrop-blur-sm hover:scale-105"
          >
            <div
              className={`bg-gradient-to-br ${category.color} p-3 rounded-full mb-2 shadow-lg group-hover:shadow-xl transition-all duration-300`}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
            <span className="text-white text-sm font-medium group-hover:text-purple-200 transition-colors">
              {category.name}
            </span>
          </Link>
        )
      })}
    </div>
  )
}