/**
 * Service pour gérer les entrées de recherche
 */

import { v4 as uuidv4 } from 'uuid';
import { SearchType } from '@/hooks/use-search';
import { convertImageToBase64 } from '@/lib/media/image-service';
import { createClient } from '@/lib/supabase/client';

// Types d'entrée de recherche
export enum InputType {
  TEXT = 'text',
  VOICE = 'voice',
  IMAGE = 'image'
}

// Interface pour les données de localisation
export interface LocationData {
  country: string;
  city: string;
  lat: number;
  lon: number;
  isFallback?: boolean;
}

// Interface pour les entrées de recherche
export interface SearchInput {
  uid: string | null;       // ID utilisateur (null si non connecté)
  inputType: InputType;     // Type d'entrée (texte, voix, image)
  locationData: LocationData | null; // Données de localisation
  imageData: string | null; // Image en Base64 (si présente)
  query: string;           // Texte de la recherche
  timestamp: number;       // Horodatage
  requestId: string;       // ID unique de la requête
  searchType?: SearchType; // Type de recherche (produit, service, tous)
}

/**
 * Crée un objet SearchInput avec les paramètres fournis
 * @param {string} query - Texte de la recherche
 * @param {InputType} inputType - Type d'entrée (texte, voix, image)
 * @param {LocationData | null} locationData - Données de localisation
 * @param {string | null} imageData - Image en Base64 (si présente)
 * @param {SearchType} searchType - Type de recherche (produit, service, tous)
 * @returns {Promise<SearchInput>} Objet SearchInput complet
 */
export async function createSearchInput(
  query: string,
  inputType: InputType = InputType.TEXT,
  locationData: LocationData | null = null,
  imageData: string | null = null,
  searchType: SearchType = SearchType.ALL
): Promise<SearchInput> {
  // Récupérer l'utilisateur connecté via Supabase
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return {
    uid: user?.id || null,
    inputType,
    locationData,
    imageData,
    query,
    timestamp: Date.now(),
    requestId: uuidv4(),
    searchType
  };
}

/**
 * Crée un objet SearchInput à partir d'un fichier image
 * @param {File} file - Fichier image
 * @param {LocationData | null} locationData - Données de localisation
 * @param {SearchType} searchType - Type de recherche (produit, service, tous)
 * @returns {Promise<SearchInput>} Objet SearchInput complet
 */
export async function createImageSearchInput(
  file: File,
  locationData: LocationData | null = null,
  searchType: SearchType = SearchType.ALL
): Promise<SearchInput> {
  // Convertir l'image en Base64
  const base64Image = await convertImageToBase64(file);
  
  // Créer un texte de requête par défaut
  const query = `Recherche par image: ${file.name}`;
  
  return createSearchInput(
    query,
    InputType.IMAGE,
    locationData,
    base64Image,
    searchType
  );
}