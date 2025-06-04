/**
 * Service pour gérer les opérations liées à la recherche
 */

import { SearchType, SearchResult } from '@/hooks/use-search';
import { SearchInput } from './search-input';

export interface SearchRequestData {
  query: string;
  type: SearchType;
  location?: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
  imageData?: string;
  inputType?: string;
  uid?: string | null;
  requestId?: string;
}

export interface SearchResponseData {
  results: SearchResult[];
  totalResults: number;
  executionTime?: number;
}

/**
 * Effectue une recherche via l'API
 * @param {SearchInput} searchInput - Objet complet de recherche
 * @returns {Promise<SearchResponseData>} Résultats de la recherche
 */
export async function search(searchInput: SearchInput): Promise<SearchResponseData> {
  try {
    // Convertir SearchInput en SearchRequestData pour compatibilité
    const data: SearchRequestData = {
      query: searchInput.query,
      type: searchInput.searchType || SearchType.ALL,
      location: searchInput.locationData ? {
        latitude: searchInput.locationData.lat,
        longitude: searchInput.locationData.lon,
        city: searchInput.locationData.city,
        country: searchInput.locationData.country
      } : undefined,
      imageData: searchInput.imageData || undefined,
      inputType: searchInput.inputType,
      uid: searchInput.uid,
      requestId: searchInput.requestId
    };

    // Utiliser l'URL du webhook n8n si définie dans les variables d'environnement
    const searchUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '/api/search';
    
    const response = await fetch(searchUrl, {
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
 * Effectue une recherche via l'API (version compatible avec l'ancienne interface)
 * @param {SearchRequestData} data - Données de la recherche
 * @returns {Promise<SearchResponseData>} Résultats de la recherche
 */
export async function searchLegacy(data: SearchRequestData): Promise<SearchResponseData> {
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