"use client"

import { useSearchParams } from "next/navigation"
import { SearchResultats } from "./card-searchresultats"
import ListSearchResultats from "./list-searchresultats"
import { ImageGallery, RelatedSearches } from "@/components/search/resultats-suggestion"
import { motion } from "framer-motion"
import { useSearchState } from "@/contexts/search-state-context" // Import new context hook
import { MultiStepLoader } from "@/components/search/multi-step-loader"
import { RenderStrategy, ViewMode } from "@/components/search/render-strategy"
import { useState } from "react"
import { useRouter } from "next/navigation" // For retry navigation

export default function Resultats() {
    const searchParams = useSearchParams();
    const router = useRouter(); // For retry navigation

    // Get query from URL for display purposes, but primary data comes from context
    const displayQuery = searchParams.get("q") || "Recherche";
    // requestId from URL can be useful for debugging or if context is ever lost and needs re-sync (advanced)
    const currentRequestIdFromUrl = searchParams.get("requestId");

    const { state, dispatch } = useSearchState(); // Use the new context state and dispatch
    const { 
        isLoading,
        error, 
        results,
        totalResults,
        processingTime,
        query: contextQuery, // Query that triggered the search
        requestId: contextRequestId // RequestId of the current/last search in context
    } = state;
    
    const [viewMode, setViewMode] = useState<ViewMode>("grid");

    // The query to display in the loader should be the one from the context if available (i.e., during/after search)
    // or fallback to the URL's query if context is not yet populated for this specific navigation.
    const loaderQuery = isLoading ? contextQuery : displayQuery;
    const loaderRequestId = isLoading ? contextRequestId : currentRequestIdFromUrl;

    const handleRetry = () => {
      dispatch({ type: 'CLEAR_SEARCH_STATE' });
      // Navigate to home or allow a new search. For now, navigating to home.
      router.push('/');
    };
    
    const handleLoadingComplete = () => {
        // This callback is for MultiStepLoader's onComplete.
        // The actual setting of loading to false is handled by SET_SEARCH_RESULTS or SET_SEARCH_ERROR actions.
        // console.log("MultiStepLoader's onComplete fired. Search state isLoading:", isLoading);
    };

    return(
        <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-grow flex flex-col items-center justify-center z-20 md:px-8 sm:px-8 py-0 mx-auto mt-20 max-w-7xl"
        >
            {/* Render MultiStepLoader at a high level if loading */}
            {isLoading && (
                <MultiStepLoader
                    isLoading={true} // Pass true directly
                    onComplete={handleLoadingComplete}
                    processingTime={processingTime || 0}
                    requestId={loaderRequestId || undefined}
                    query={loaderQuery || ""}
                />
            )}

            <div className="pb-8"></div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="w-full rounded-2xl overflow-hidden border border-white/10 transition-all duration-300 hover:shadow-purple-500/20"
            >
                <div className="h-auto overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent scrollbar-thumb-rounded">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-3 space-y-6">
                            <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 shadow-2xl border border-white/10">
                                <p className="text-white text-lg font-semibold">
                                    Résultats pour : <span className="text-white/80 font-normal">{displayQuery}</span>
                                </p>
                                
                                {/* Conditional Content Display based on context state */}
                                {!isLoading && error && (
                                    <div className="bg-red-500/20 backdrop-blur-md rounded-xl p-6 my-4 text-white text-center">
                                        <p className="font-semibold text-lg">Une erreur est survenue lors de la recherche.</p>
                                        <p className="text-sm mb-4">{error}</p>
                                        <button 
                                            onClick={handleRetry}
                                            className="mt-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition-colors"
                                        >
                                            Réessayer
                                        </button>
                                    </div>
                                )}

                                {!isLoading && !error && results.length === 0 && (
                                     <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 my-4 text-white text-center">
                                        <p className="font-semibold text-lg">Aucun résultat trouvé.</p>
                                        <p className="text-sm mb-4">Essayez une autre recherche ou vérifiez vos termes.</p>
                                     </div>
                                )}

                                {!isLoading && !error && results.length > 0 && (
                                    <RenderStrategy 
                                        results={results} 
                                        totalResults={totalResults}
                                        onViewModeChange={setViewMode}
                                    >
                                        {(filteredResults) => (
                                            viewMode === "grid" ? (
                                                <SearchResultats results={filteredResults} isLoading={false} />
                                            ) : (
                                                <ListSearchResultats results={filteredResults} />
                                            )
                                        )}
                                    </RenderStrategy>
                                )}
                            </div>
                        </div>
                        
                        <div className="lg:col-span-1 space-y-6">
                            {/* These could also be conditional based on search type or results */}
                            {!isLoading && !error && (
                                <>
                                    <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/10">
                                        <ImageGallery query={displayQuery} />
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/10">
                                        <RelatedSearches query={displayQuery} />
                                    </div>
                                </>
                            )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.main>
    )
}