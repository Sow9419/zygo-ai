"use client"

import { useSearchParams } from "next/navigation"
import { SearchResultats } from "./card-searchresultats"
import ListSearchResultats from "./list-searchresultats"
import { ImageGallery, RelatedSearches } from "@/components/search/resultats-suggestion"
import { motion } from "framer-motion"
import { useSearchResults } from "@/hooks/use-search-results"
import { MultiStepLoader } from "@/components/search/multi-step-loader"
import { RenderStrategy, ViewMode } from "@/components/search/render-strategy"
import { useState } from "react"

export default function Resultats() {
    // Récupérer le paramètre de recherche depuis l'URL
    const searchParams = useSearchParams()
    const query = searchParams.get("q") || "produits populaires"
    const requestId = searchParams.get("requestId")
    
    // État pour le mode d'affichage (grille ou liste)
    const [viewMode, setViewMode] = useState<ViewMode>("grid")
    
    // Utiliser le hook personnalisé pour récupérer les résultats
    const { 
        results, 
        status, 
        error, 
        processingTime, 
        totalResults,
        reset
    } = useSearchResults()
    
    // Déterminer si nous sommes en train de charger
    const isLoading = status === 'loading'
    
    // Fonction pour gérer la fin du chargement
    const handleLoadingComplete = () => {
        // Rien à faire ici pour l'instant
    }

    return(
        <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-grow flex flex-col items-center justify-center z-20 md:px-8 sm:px-8 py-0 mx-auto mt-20 max-w-7xl"
        >
            <div className="pb-8"></div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="w-full rounded-2xl overflow-hidden border border-white/10 transition-all duration-300 hover:shadow-purple-500/20"
            >
                <div className="h-auto overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent scrollbar-thumb-rounded">
                    
                    {/* Conditional rendering for Loader, outside the main grid if it needs to overlay */}
                    {isLoading && (
                        <MultiStepLoader
                            isLoading={isLoading}
                            onComplete={handleLoadingComplete}
                            processingTime={processingTime || 0}
                            requestId={requestId || undefined}
                            query={query}
                        />
                    )}

                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Zone principale des résultats - occupe 3 colonnes sur grand écran */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-white/10">
                                <p className="text-white text-lg font-semibold">Résultats trouvés : <span className="text-white/80 font-normal">{query}</span></p>
                                
                                {/* Afficher les résultats ou une erreur si le chargement est terminé */}
                                {!isLoading && error ? (
                                    <div className="bg-red-500/20 backdrop-blur-md rounded-xl p-6 my-4 text-white">
                                        <p>Une erreur est survenue lors de la recherche. Veuillez réessayer.</p>
                                        <button 
                                            onClick={reset}
                                            className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                                        >
                                            Réessayer
                                        </button>
                                    </div>
                                ) : !isLoading && !error ? (
                                    <RenderStrategy 
                                        results={results} 
                                        totalResults={totalResults}
                                        onViewModeChange={setViewMode}
                                    >
                                        {(filteredResults) => (
                                            viewMode === "grid" ? (
                                                <SearchResultats results={filteredResults} isLoading={isLoading} />
                                            ) : (
                                                <ListSearchResultats results={filteredResults} />
                                            )
                                        )}
                                    </RenderStrategy>
                                ) : null} {/* Ne rien afficher ici si isLoading est true, car le loader est géré au-dessus */}
                            </div>
                        </div>
                        
                        {/* Sidebar - occupe 1 colonne sur grand écran */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Galerie d'images */}
                            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/10">
                                <ImageGallery query={query} />
                            </div>
                            {/* Recherches associées */}
                            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/10">
                                <RelatedSearches query={query} />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.main>
    )
}