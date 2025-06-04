"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Database, Cpu, Zap, CheckCircle } from "lucide-react"
import { Progress } from "../ui/progress"

export interface MultiStepLoaderProps {
  isLoading: boolean
  onComplete?: () => void
  processingTime?: number
  requestId?: string
  query?: string
}

interface Step {
  id: number
  icon: React.ReactNode
  title: string
  description: string
  duration: number
}

export function MultiStepLoader({ 
  isLoading, 
  onComplete, 
  processingTime = 0,
  requestId,
  query
}: MultiStepLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  // Définir les étapes du processus de recherche
  const steps: Step[] = [
    {
      id: 1,
      icon: <Search className="h-6 w-6 text-blue-500" />,
      title: "Analyse de la requête",
      description: query ? `Traitement de "${query}"` : "Préparation de la recherche",
      duration: 1500,
    },
    {
      id: 2,
      icon: <Database className="h-6 w-6 text-purple-500" />,
      title: "Recherche dans les bases de données",
      description: "Exploration des sources d'information",
      duration: 2000,
    },
    {
      id: 3,
      icon: <Cpu className="h-6 w-6 text-green-500" />,
      title: "Traitement des résultats",
      description: "Analyse et classement des résultats",
      duration: 1500,
    },
    {
      id: 4,
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Finalisation",
      description: "Préparation de l'affichage",
      duration: 1000,
    },
  ]

  // Réinitialiser l'état lorsque isLoading change
  useEffect(() => {
    if (isLoading) {
      setCurrentStep(0)
      setProgress(0)
      setIsComplete(false)
    }
  }, [isLoading])

  // Gérer la progression à travers les étapes
  useEffect(() => {
    if (!isLoading || isComplete) return

    let timer: NodeJS.Timeout
    
    // Si nous sommes à la dernière étape, marquer comme terminé
    if (currentStep >= steps.length) {
      setIsComplete(true)
      if (onComplete) {
        timer = setTimeout(() => {
          onComplete()
        }, 1000) // Délai avant d'appeler onComplete
      }
      return () => clearTimeout(timer)
    }

    // Calculer la progression globale
    const progressIncrement = 100 / steps.length
    setProgress(Math.min(((currentStep) / steps.length) * 100, 100))

    // Passer à l'étape suivante après la durée spécifiée
    timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1)
    }, steps[currentStep]?.duration || 1500)

    return () => clearTimeout(timer)
  }, [currentStep, isLoading, isComplete, onComplete, steps])

  // Ne rien afficher si pas en chargement
  if (!isLoading && !isComplete) return null

  return (
    <AnimatePresence>
      {(isLoading || isComplete) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div 
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-2xl max-w-md w-full mx-4"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <div className="space-y-6">
              {/* En-tête */}
              <div className="text-center">
                <h2 className="text-xl font-bold text-white mb-1">
                  {isComplete ? "Recherche terminée !" : "Recherche en cours..."}
                </h2>
                <p className="text-white/70 text-sm">
                  {requestId && <span className="text-xs opacity-50">ID: {requestId.substring(0, 8)}...</span>}
                </p>
              </div>

              {/* Barre de progression */}
              <div className="space-y-2">
                <Progress value={progress} className="h-2 bg-white/10" />
                <div className="flex justify-between text-xs text-white/50">
                  <span>Progression</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>

              {/* Étape actuelle */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep < steps.length ? currentStep : 'complete'}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex-shrink-0 bg-white/10 rounded-full p-3">
                      {isComplete ? (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      ) : (
                        currentStep < steps.length ? steps[currentStep].icon : <Zap className="h-6 w-6 text-yellow-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-white">
                        {isComplete 
                          ? "Prêt à afficher les résultats" 
                          : currentStep < steps.length 
                            ? steps[currentStep].title 
                            : "Finalisation"}
                      </h3>
                      <p className="text-sm text-white/70">
                        {isComplete 
                          ? processingTime 
                            ? `Traitement effectué en ${processingTime.toFixed(2)}s` 
                            : "Traitement terminé avec succès"
                          : currentStep < steps.length 
                            ? steps[currentStep].description 
                            : "Préparation de l'affichage"}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Étapes précédentes (version simplifiée) */}
              <div className="flex justify-between px-2">
                {steps.map((step, index) => (
                  <div 
                    key={step.id} 
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index < currentStep || isComplete ? 'bg-white' : 'bg-white/20'}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}