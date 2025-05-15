/**
 * Service pour gérer les opérations liées à la recherche
 */

import { SearchType, SearchResult } from '@/hooks/use-search';

export interface SearchRequestData {
  query: string;
  type: SearchType;
  location?: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
}

export interface SearchResponseData {
  results: SearchResult[];
  totalResults: number;
  executionTime?: number;
}

/**
 * Effectue une recherche via l'API
 * @param {SearchRequestData} data - Données de la recherche
 * @returns {Promise<SearchResponseData>} Résultats de la recherche
 */
export async function search(data: SearchRequestData): Promise<SearchResponseData> {
  try {
    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Erreur de recherche: ${response.status}`);
    }
    
    const responseData = await response.json();
    
    return {
      results: responseData.results || [],
      totalResults: responseData.totalResults || responseData.results?.length || 0,
      executionTime: responseData.executionTime
    };
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    throw error;
  }
}

/**
 * Récupère les suggestions de recherche basées sur une requête partielle
 * @param {string} query - Texte partiel de recherche
 * @param {SearchType} type - Type de recherche (produit ou service)
 * @returns {Promise<string[]>} Liste de suggestions
 */
export async function getSuggestions(query: string, type: SearchType): Promise<string[]> {
  if (!query.trim()) {
    return [];
  }
  
  try {
    const response = await fetch(`/api/suggestions?q=${encodeURIComponent(query)}&type=${type}`);
    
    if (!response.ok) {
      throw new Error(`Erreur de récupération des suggestions: ${response.status}`);
    }
    
    const data = await response.json();
    return data.suggestions || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des suggestions:', error);
    return [];
  }
}

/**
 * Récupère les recherches tendances
 * @param {SearchType} type - Type de recherche (produit ou service)
 * @returns {Promise<string[]>} Liste des recherches tendances
 */
export async function getTrendingSearches(type: SearchType): Promise<string[]> {
  try {
    const response = await fetch(`/api/trending?type=${type}`);
    
    if (!response.ok) {
      throw new Error(`Erreur de récupération des tendances: ${response.status}`);
    }
    
    const data = await response.json();
    return data.trending || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des tendances:', error);
    return [];
  }
} 