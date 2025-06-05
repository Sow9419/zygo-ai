import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useLocationContext, type LocationData as ContextLocationData } from '@/contexts/location-context';
import { useSearchState } from '@/contexts/search-state-context';
import { createSearchInput, createImageSearchInput, InputType, type LocationData as SearchLocationData } from '@/lib/searchs-ervice/search-input';
import { search as performSearch } from '@/lib/searchs-ervice/search-service';
import { SearchType } from '@/hooks/use-search'; // Assuming SearchType is needed for createSearchInput

// Helper to transform location data (consistent with navbar.tsx and search-bar.tsx)
function transformLocationData(contextLocationData: ContextLocationData | null): SearchLocationData | null {
  if (!contextLocationData) return null;
  return {
    country: contextLocationData.country,
    city: contextLocationData.city,
    lat: contextLocationData.location?.lat,
    lon: contextLocationData.location?.lon,
    isFallback: contextLocationData.isFallback,
  };
}

export function useSearchHandler() {
  const router = useRouter();
  const { user } = useAuth();
  const locationContextHook = useLocationContext();
  const { dispatch } = useSearchState();

  const executeSearch = async (
    query: string,
    inputType: InputType,
    searchType: SearchType = SearchType.ALL,
    file?: File
  ) => {
    const newRequestId = crypto.randomUUID();
    const actualQuery = inputType === InputType.IMAGE && file ? `Image search: ${file.name}` : query;

    // Dispatch START_SEARCH action immediately
    dispatch({ type: 'START_SEARCH', payload: { query: actualQuery, requestId: newRequestId } });

    // Navigate to search results page
    router.push(`/search?q=${encodeURIComponent(actualQuery)}&requestId=${newRequestId}`);

    try {
      const searchServiceLocationData = transformLocationData(locationContextHook?.locationData || null);
      let searchInput;

      if (inputType === InputType.IMAGE && file) {
        searchInput = await createImageSearchInput(
          file,
          searchServiceLocationData,
          user?.id,
          searchType
        );
        // Ensure the query in searchInput matches actualQuery if it was auto-generated for images
        searchInput.query = actualQuery;
        searchInput.requestId = newRequestId; // Ensure requestId is consistent
      } else {
        searchInput = await createSearchInput(
          actualQuery,
          inputType,
          searchServiceLocationData,
          null, // No image data for text/voice
          user?.id,
          searchType
        );
        searchInput.requestId = newRequestId; // Ensure requestId is consistent
      }

      // The searchInput object now has its own requestId, ensure it's the one we use
      // If createSearchInput internal requestId is preferred, then use that one for dispatch and navigation

      const response = await performSearch(searchInput);
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: { response, query: actualQuery, requestId: newRequestId } });

    } catch (error) {
      console.error('Search handler error:', error);
      dispatch({
        type: 'SET_SEARCH_ERROR',
        payload: {
          errorMsg: error instanceof Error ? error.message : 'An unknown error occurred during search',
          query: actualQuery,
          requestId: newRequestId
        }
      });
    }
  };

  const handleTextSearch = (query: string, searchType: SearchType = SearchType.ALL) => {
    if (query.trim()) {
      executeSearch(query.trim(), InputType.TEXT, searchType);
    }
  };

  const handleImageSearch = (file: File, searchType: SearchType = SearchType.ALL) => {
    // Query for image search can be empty or derived, executeSearch handles placeholder query if needed
    executeSearch("", InputType.IMAGE, searchType, file);
  };

  const handleVoiceSearch = (transcript: string, searchType: SearchType = SearchType.ALL) => {
    if (transcript.trim()) {
      executeSearch(transcript.trim(), InputType.VOICE, searchType);
    }
  };

  return {
    handleTextSearch,
    handleImageSearch,
    handleVoiceSearch,
    // any other specific handlers if needed
  };
}
