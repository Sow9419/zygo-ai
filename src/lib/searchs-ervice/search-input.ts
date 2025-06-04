/**
 * Service pour gérer les entrées de recherche
 */

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
  uid?: string;
  inputType: InputType;
  locationData?: LocationData | null;
  imageData?: string | null;
  query: string;
  timestamp: string;
  requestId: string;
  searchType?: SearchType; // Type de recherche (produit, service, tous)
}

const supabaseClient = createClient();

async function getCurrentUserId(): Promise<string | undefined> {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user?.id;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return undefined;
  }
}

/**
 * Crée un objet SearchInput avec les paramètres fournis
 * @param {string} query - Texte de la recherche
 * @param {InputType} inputType - Type d'entrée (texte, voix, image)
 * @param {LocationData | null} locationData - Données de localisation
 * @param {string | null} imageData - Image en Base64 (si présente)
 * @param {SearchType} searchType - Type de recherche (produit, service, tous)
 * @param {string} [uid] - Optional user ID.
 * @returns {Promise<SearchInput>} Objet SearchInput complet
 */
export async function createSearchInput(
  query: string,
  inputType: InputType = InputType.TEXT,
  locationData: LocationData | null = null,
  imageData: string | null = null,
  searchType: SearchType = SearchType.ALL,
  uid?: string
): Promise<SearchInput> {
  const resolvedUid = uid || await getCurrentUserId();
  
  return {
    uid: resolvedUid,
    inputType,
    locationData,
    imageData,
    query,
    timestamp: new Date().toISOString(),
    requestId: crypto.randomUUID(),
    searchType
  };
}

/**
 * Crée un objet SearchInput à partir d'un fichier image
 * @param {File} file - Fichier image
 * @param {LocationData | null} locationData - Données de localisation
 * @param {SearchType} searchType - Type de recherche (produit, service, tous)
 * @param {string} [uid] - Optional user ID.
 * @returns {Promise<SearchInput>} Objet SearchInput complet
 */
export async function createImageSearchInput(
  file: File,
  locationData: LocationData | null = null,
  searchType: SearchType = SearchType.ALL,
  uid?: string
): Promise<SearchInput> {
  // Convertir l'image en Base64
  const base64Image = await convertImageToBase64(file);
  
  // Créer un texte de requête par défaut
  const query = `Image search: ${file.name}`;
  
  return createSearchInput(
    query,
    InputType.IMAGE,
    locationData,
    base64Image,
    searchType,
    uid
  );
}