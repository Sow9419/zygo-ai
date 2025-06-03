"use client"

import { useSearchParams } from "next/navigation"
import SearchResultats from "./card-searchresultats"
import { ImageGallery, RelatedSearches } from "@/components/search/resultats-suggestion"
import { motion } from "framer-motion"

export default function Resultats() {
    // Récupérer le paramètre de recherche depuis l'URL
    const searchParams = useSearchParams()
    const query = searchParams.get("q") || "produits populaires"

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
                className="w-full   rounded-2xl  overflow-hidden border border-white/10 transition-all duration-300 hover:shadow-purple-500/20"
            >
                <div className="h-auto overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent scrollbar-thumb-rounded">
                    
                    {/* Bento Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Zone principale des résultats - occupe 3 colonnes sur grand écran */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-white/10">
                            <p className="text-white text-lg font-semibold">Résultats trouvée : <span className="text-white/80 font-normal">{query}</span></p>
                                <SearchResultats />
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
//[calc(100vh-220px)]