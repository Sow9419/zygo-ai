"use client"

import { useState } from "react"
import { SearchResult } from "@/hooks/use-search"
import { Button } from "@/components/ui/button"
import { Grid2X2, List } from "lucide-react" // Removed MapPin, ArrowUpDown

export type ViewMode = "grid" | "list"
export type SortOption = "relevance" | "proximity" | "price_asc" | "price_desc" | "rating"

export interface RenderStrategyProps {
  results: SearchResult[]
  totalResults: number
  onViewModeChange?: (mode: ViewMode) => void
  children: (filteredResults: SearchResult[]) => React.ReactNode
}

export function RenderStrategy({ results, totalResults, onViewModeChange, children }: RenderStrategyProps) {
  // État pour le mode d'affichage (grille ou liste)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  
  // Fonction pour changer le mode d'affichage et notifier le parent
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    if (onViewModeChange) {
      onViewModeChange(mode)
    }
  }
  
  // État pour l'option de tri
  const [sortOption, setSortOption] = useState<SortOption>("relevance")
  
  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  
  // Calculer les résultats à afficher en fonction de la pagination
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  
  // Trier les résultats en fonction de l'option de tri
  const sortResults = (resultsToSort: SearchResult[]): SearchResult[] => { // Renamed 'results' to 'resultsToSort' to avoid conflict with props
    const sortedResults = [...resultsToSort]; // Use the function parameter
    
    switch (sortOption) {
      case "proximity":
        // Tri par proximité (simulation)
        // Removed unused variables a and b. The random sort is kept for simulation.
        return sortedResults.sort(() => Math.random() - 0.5);
      case "price_asc":
        // Tri par prix croissant
        return sortedResults.sort((a, b) => {
          const priceA = parseFloat(a.price?.replace(/[^0-9.]/g, '') || '0')
          const priceB = parseFloat(b.price?.replace(/[^0-9.]/g, '') || '0')
          return priceA - priceB
        })
      case "price_desc":
        // Tri par prix décroissant
        return sortedResults.sort((a, b) => {
          const priceA = parseFloat(a.price?.replace(/[^0-9.]/g, '') || '0')
          const priceB = parseFloat(b.price?.replace(/[^0-9.]/g, '') || '0')
          return priceB - priceA
        })
      case "rating":
        // Tri par note
        return sortedResults.sort((a, b) => {
          const ratingA = a.rating || 0
          const ratingB = b.rating || 0
          return ratingB - ratingA
        })
      case "relevance":
      default:
        // Par défaut, on conserve l'ordre initial (supposé être par pertinence)
        return sortedResults
    }
  }
  
  // Appliquer le tri et la pagination
  const displayedResults = sortResults(results).slice(startIndex, endIndex) // Prop 'results' is correctly used here
  
  // Calculer le nombre total de pages
  const totalPages = Math.ceil(results.length / itemsPerPage) // Prop 'results' is correctly used here
  
  // Fonction pour changer de page
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Faire défiler vers le haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  return (
    <div className="space-y-4">
      {/* Contrôles de rendu */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-2 border border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/70">{totalResults} résultats</span>
          
          <div className="flex items-center bg-white/5 rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 px-2 rounded-none ${viewMode === 'grid' ? 'bg-white/20 text-white' : 'text-white/70'}`}
              onClick={() => handleViewModeChange("grid")}
            >
              <Grid2X2 className="h-4 w-4 mr-1" />
              Grille
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-8 px-2 rounded-none ${viewMode === 'list' ? 'bg-white/20 text-white' : 'text-white/70'}`}
              onClick={() => handleViewModeChange("list")}
            >
              <List className="h-4 w-4 mr-1" />
              Liste
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/70">Trier par:</span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="bg-white/5 border border-white/10 text-white/90 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="relevance">Pertinence</option>
            <option value="proximity">Proximité</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="rating">Note</option>
          </select>
          
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value))
              setCurrentPage(1) // Réinitialiser à la première page
            }}
            className="bg-white/5 border border-white/10 text-white/90 text-sm rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="9">9 par page</option>
            <option value="18">18 par page</option>
            <option value="27">27 par page</option>
            <option value="36">36 par page</option>
          </select>
        </div>
      </div>
      
      {/* Conteneur des résultats avec classe conditionnelle basée sur le mode d'affichage */}
      <div className={viewMode === "grid" ? "grid-view" : "list-view"}>
        {children(displayedResults)}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="h-8 w-8 p-0 text-white/80 bg-white/5 border-white/10 hover:bg-white/10"
            >
              &lt;
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className={`h-8 w-8 p-0 ${currentPage === page ? 'bg-purple-600 text-white border-purple-600' : 'text-white/80 bg-white/5 border-white/10 hover:bg-white/10'}`}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="h-8 w-8 p-0 text-white/80 bg-white/5 border-white/10 hover:bg-white/10"
            >
              &gt;
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}