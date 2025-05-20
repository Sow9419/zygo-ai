"use client"

import ProductResultats from "./product-resultats"
import { motion } from "framer-motion"

export default function Resultats() {

    return(
        <motion.main 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-grow flex flex-col items-center justify-center z-20 px-0 py-0 mx-auto mt-20 max-w-5xl"
        >
            <div className="pb-8"></div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="w-full max-w-5xl bg-white/15 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/10 transition-all duration-300 hover:shadow-purple-500/20"
            >
                <div className="h-auto overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent scrollbar-thumb-rounded px-4 py-4">
                <div className="w-full max-w-5xl text-center mb-0">
                   <h1 className="text-4xl md:text-2xl font-bold mb-1 text-white drop-shadow-lg transition-all duration-300 hover:scale-105">Résultats de la recherche</h1>
                   <span>query</span>
                </div>
                    <ProductResultats />
                </div>
            </motion.div>
        </motion.main>
    )
}
//[calc(100vh-220px)]