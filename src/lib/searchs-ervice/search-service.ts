/**
 * Service pour gérer les opérations liées à la recherche
 */

import { SearchType, SearchResult } from '@/hooks/use-search';
import { SearchInput, LocationData } from './search-input'; // Ensure LocationData is imported

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
  // Add other fields from n8n response if necessary, like status, suggestions, processingTime
  status?: string;
  suggestions?: string[];
  processingTime?: number;
}

/**
 * Effectue une recherche via l'API
 * @param {SearchInput} searchInput - Objet complet de recherche
 * @returns {Promise<SearchResponseData>} Résultats de la recherche
 */
export async function search(searchInput: SearchInput): Promise<SearchResponseData> {
  try {
    const locationObject = searchInput.locationData &&
                           typeof searchInput.locationData.lat === 'number' &&
                           typeof searchInput.locationData.lon === 'number'
      ? {
          latitude: searchInput.locationData.lat,
          longitude: searchInput.locationData.lon,
          city: searchInput.locationData.city,
          country: searchInput.locationData.country
        }
      : undefined;

    const data: SearchRequestData = {
      query: searchInput.query,
      type: searchInput.searchType || SearchType.ALL, // Use searchType from input or default
      location: locationObject,
      imageData: searchInput.imageData || undefined,
      inputType: searchInput.inputType, // Pass InputType as string
      uid: searchInput.uid || null, // Pass uid, ensure it's null if undefined for API
      requestId: searchInput.requestId
    };

    // ALWAYS call /api/search as per new plan. Webhook URL logic removed from client-side.
    const searchUrl = '/api/search';
    
    const response = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Search API response error body:", errorBody);
      throw new Error(`Erreur de recherche: ${response.status} ${response.statusText}`);
    }
    
    const responseData = await response.json();
    
    return {
      results: responseData.results || [],
      totalResults: responseData.totalResults || responseData.results?.length || 0,
      executionTime: responseData.executionTime,
      status: responseData.status,
      suggestions: responseData.suggestions,
      processingTime: responseData.processingTime
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