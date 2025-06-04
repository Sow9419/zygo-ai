/**
 * Hook personnalisé pour gérer les résultats de recherche
 */

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { SearchType, SearchResult } from './use-search'
import { search } from '@/lib/searchs-ervice/search-service'
import { createSearchInput, InputType } from '@/lib/searchs-ervice/search-input'

export interface SearchResultsState {
  results: SearchResult[]
  suggestions: string[]
  status: 'idle' | 'loading' | 'success' | 'error'
  error: string | null
  processingTime: number | null
  totalResults: number
  requestId: string | null
  query: string | null
}

export function useSearchResults() {
  const searchParams = useSearchParams()
  
  // État initial
  const [state, setState] = useState<SearchResultsState>({
    results: [],
    suggestions: [],
    status: 'idle',
    error: null,
    processingTime: null,
    totalResults: 0,
    requestId: null,
    query: null
  })

  // Récupérer les paramètres de l'URL
  const query = searchParams.get('q')
  const requestId = searchParams.get('requestId')
  
  // Effectuer la recherche lorsque les paramètres changent
  useEffect(() => {
    if (!query) return
    
    const fetchResults = async () => {
      try {
        // Mettre à jour l'état pour indiquer le chargement
        setState(prev => ({
          ...prev,
          status: 'loading',
          query,
          requestId: requestId || null
        }))
        
        // Créer un timestamp pour mesurer le temps de traitement
        const startTime = performance.now()
        
        // Si nous avons un requestId, nous pouvons supposer que la recherche a déjà été initiée
        // et nous pouvons récupérer les résultats directement
        let responseData
        
        if (requestId) {
          // Récupérer les résultats avec le requestId
          responseData = await fetch(`/api/search/results?requestId=${requestId}`)
            .then(res => res.json())
        } else {
          // Sinon, effectuer une nouvelle recherche
          const searchInput = await createSearchInput(
            query,
            InputType.TEXT,
            null, // locationData
            null, // imageData
            SearchType.ALL
          )
          
          responseData = await search(searchInput)
        }
        
        // Calculer le temps de traitement
        const endTime = performance.now()
        const processingTime = responseData.executionTime || (endTime - startTime) / 1000
        
        // Mettre à jour l'état avec les résultats
        setState({
          results: responseData.results || [],
          suggestions: responseData.suggestions || [],
          status: 'success',
          error: null,
          processingTime,
          totalResults: responseData.totalResults || responseData.results?.length || 0,
          requestId: requestId || responseData.requestId || null,
          query
        })
      } catch (error) {
        console.error('Erreur lors de la récupération des résultats:', error)
        
        // Mettre à jour l'état pour indiquer l'erreur
        setState(prev => ({
          ...prev,
          status: 'error',
          error: error instanceof Error ? error.message : 'Une erreur est survenue',
          query
        }))
      }
    }
    
    fetchResults()
  }, [query, requestId])
  
  // Fonction pour réinitialiser l'état
  const reset = () => {
    setState({
      results: [],
      suggestions: [],
      status: 'idle',
      error: null,
      processingTime: null,
      totalResults: 0,
      requestId: null,
      query: null
    })
  }
  
  return {
    ...state,
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    reset
  }
}