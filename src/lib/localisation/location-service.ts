/**
 * Service pour gérer les opérations liées à la localisation
 */

export interface GeocodingResult {
    city: string;
    region: string;
    country: string;
    displayName: string;
    latitude: number;
    longitude: number;
  }
  
  /**
   * Convertit des coordonnées en adresse lisible via l'API de géocodage
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @returns {Promise<GeocodingResult>} Résultat du géocodage
   */
  export async function reverseGeocode(latitude: number, longitude: number): Promise<GeocodingResult> {
    try {
      const response = await fetch(`/api/location?lat=${latitude}&lon=${longitude}`);
      
      if (!response.ok) {
        throw new Error(`Erreur de géocodage: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        city: data.city || 'Ville inconnue',
        region: data.region || '',
        country: data.country || 'Pays inconnu',
        displayName: data.displayName || `${data.city || 'Ville inconnue'}, ${data.country || 'Pays inconnu'}`,
        latitude,
        longitude
      };
    } catch (error) {
      console.error('Erreur lors du géocodage inverse:', error);
      // Valeurs par défaut en cas d'erreur
      return {
        city: 'Paris',
        region: 'Île-de-France',
        country: 'France',
        displayName: 'Paris, France',
        latitude: 48.8566,
        longitude: 2.3522
      };
    }
  }
  
  /**
   * Recherche des lieux à partir d'un texte de requête
   * @param {string} query - Texte de recherche (ex: "Paris, France")
   * @returns {Promise<GeocodingResult[]>} Résultats de la recherche
   */
  export async function searchPlaces(query: string): Promise<GeocodingResult[]> {
    try {
      const response = await fetch(`/api/location/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`Erreur de recherche de lieux: ${response.status}`);
      }
      
      const data = await response.json();
      
      return data.results.map((place: {
        city?: string;
        region?: string;
        country?: string;
        displayName?: string;
        latitude: number;
        longitude: number;
      }) => ({
        city: place.city || '',
        region: place.region || '',
        country: place.country || '',
        displayName: place.displayName || `${place.city || ''}, ${place.country || ''}`,
        latitude: place.latitude,
        longitude: place.longitude
      }));
    } catch (error) {
      console.error('Erreur lors de la recherche de lieux:', error);
      return [];
    }
  }
  
  /**
   * Obtient la position de l'utilisateur via l'API de géolocalisation du navigateur
   * @returns {Promise<{latitude: number, longitude: number}>} Coordonnées de l'utilisateur
   */
  export async function getUserPosition(): Promise<{latitude: number, longitude: number}> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('La géolocalisation n\'est pas prise en charge par votre navigateur'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error(`Erreur de géolocalisation: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }