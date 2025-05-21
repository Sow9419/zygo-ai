"use client"

import {
  Plug2,
  Footprints,
  ArmchairIcon,
  UtensilsCrossed,
  UserSearchIcon,
  HousePlug,
  TruckElectric,
  MonitorCog,
  DamIcon,
  Shirt,
  HeartPlus,
  HousePlusIcon,
} from "lucide-react"

const categories = [
  { name: "Électronique", icon: Plug2, query: "Où Acheter un téléphone à proximité", color: "from-blue-500 to-blue-600" },
  { name: "Vêtements", icon: Shirt, query: "Vêtements pour homme à proximité", color: "from-purple-500 to-purple-600" },
  { name: "Chaussures", icon: Footprints, query: "Baskets pour femme à proximité", color: "from-green-500 to-green-600" },
  { name: "Meubles & Déco", icon: ArmchairIcon, query: "Canapé en vente à proximité", color: "from-yellow-500 to-yellow-600" },
  { name: "Alimentation", icon: UtensilsCrossed, query: "Trouve les meilleurs points de vente de fruits, légumes à proximité", color: "from-red-500 to-red-600" },
  { name: "Beauté & Accessoires", icon: HeartPlus, query: "Parfums femme à proximité", color: "from-pink-500 to-pink-600" },

  { name: "Électricité / Plomberie", icon: HousePlug, query: "Plombier disponible à proximité", color: "from-indigo-500 to-indigo-600" },
  { name: "Livraison", icon: TruckElectric, query: "Coursier rapide à proximité", color: "from-orange-500 to-orange-600" },
  { name: "Réparation", icon: MonitorCog, query: "Réparation téléphone à proximité", color: "from-teal-500 to-teal-600" },
  { name: "Coiffure / Esthétique", icon: DamIcon, query: "Salon de coiffure à proximité", color: "from-amber-500 to-amber-600" },
  { name: "Location logement", icon: HousePlusIcon, query: "Chambre à louer à proximité", color: "from-rose-500 to-rose-600" },
  { name: "Freelance / Digital", icon: UserSearchIcon, query: "Graphiste freelance à proximité", color: "from-gray-500 to-gray-600" },
]

interface CategoryButtonsProps {
  setQuery: (query: string) => void;
}

export function CategoryButtons({ setQuery }: CategoryButtonsProps) {
  const handleCategoryClick = (query: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setQuery(query);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {categories.map((category) => {
        const Icon = category.icon
        return (
          <button
            key={category.name}
            onClick={handleCategoryClick(category.query)}
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
          </button>
        )
      })}
    </div>
  )
}