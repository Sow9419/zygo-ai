"use client"

import ProductResultats from "./product-resultats"
import { motion } from "framer-motion"

export default function Resultats() {
    return(
        <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-grow flex flex-col items-center justify-center z-20 px-0 py-0 mx-auto mt-20 max-w-7xl"
        >
            <div className="w-full max-w-5xl text-center mb-6">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg transition-all duration-300 hover:scale-105">Résultats de la recherche</h1>
            </div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/10 transition-all duration-300 hover:shadow-purple-500/20"
            >
                <div className="h-auto overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent scrollbar-thumb-rounded">
                    <ProductResultats />
                </div>
            </motion.div>
        </motion.main>
    )
}
//[calc(100vh-220px)]