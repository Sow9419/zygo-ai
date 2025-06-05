"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import type { SearchResult } from '@/hooks/use-search'; // Assuming SearchResult is defined here
import type { SearchResponseData } from '@/lib/searchs-ervice/search-service'; // For payload of setSearchResults

// 1. Define State Shape
interface SearchState {
  isLoading: boolean;
  requestId: string | null;
  query: string | null;
  results: SearchResult[];
  error: string | null;
  processingTime: number | null;
  totalResults: number;
  // Potentially add suggestions if needed from SearchResponseData
  suggestions?: string[];
}

// Initial State
const initialState: SearchState = {
  isLoading: false,
  requestId: null,
  query: null,
  results: [],
  error: null,
  processingTime: null,
  totalResults: 0,
  suggestions: [],
};

// 2. Define Action Types
type Action =
  | { type: 'START_SEARCH'; payload: { query: string; requestId: string } }
  | { type: 'SET_SEARCH_RESULTS'; payload: { response: SearchResponseData; query: string; requestId: string } }
  | { type: 'SET_SEARCH_ERROR'; payload: { errorMsg: string; query: string; requestId: string } }
  | { type: 'CLEAR_SEARCH_STATE' };

// 3. Create Reducer Function
function searchReducer(state: SearchState, action: Action): SearchState {
  switch (action.type) {
    case 'START_SEARCH':
      return {
        ...initialState, // Reset most fields
        isLoading: true,
        query: action.payload.query,
        requestId: action.payload.requestId,
      };
    case 'SET_SEARCH_RESULTS':
      // Ensure payload matches this structure from where it's dispatched
      return {
        ...state,
        isLoading: false,
        results: action.payload.response.results || [],
        totalResults: action.payload.response.totalResults || (action.payload.response.results || []).length,
        processingTime: action.payload.response.processingTime || state.processingTime, // Keep previous if not in new response
        suggestions: action.payload.response.suggestions || [],
        error: null,
        // Keep query and requestId from the action that initiated this result set
        query: action.payload.query,
        requestId: action.payload.requestId,
      };
    case 'SET_SEARCH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload.errorMsg,
        results: [], // Clear results on error
        totalResults: 0,
        // Keep query and requestId for context of the error
        query: action.payload.query,
        requestId: action.payload.requestId,
      };
    case 'CLEAR_SEARCH_STATE':
      return initialState;
    default:
      return state;
  }
}

// 4. Define Context Value Type (State + Dispatch)
interface SearchContextType {
  state: SearchState;
  dispatch: React.Dispatch<Action>;
  // Convenience action wrappers can be added here if preferred over direct dispatch
  // e.g., startSearch: (query: string, requestId: string) => void;
}

// 5. Create Context
const SearchStateContext = createContext<SearchContextType | undefined>(undefined);

// 6. Implement SearchStateProvider
interface SearchStateProviderProps {
  children: ReactNode;
}

export function SearchStateProvider({ children }: SearchStateProviderProps) {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  return (
    <SearchStateContext.Provider value={{ state, dispatch }}>
      {children}
    </SearchStateContext.Provider>
  );
}

// 7. Implement useSearchState Hook
export function useSearchState() {
  const context = useContext(SearchStateContext);
  if (context === undefined) {
    throw new Error('useSearchState must be used within a SearchStateProvider');
  }
  // Expose dispatch directly, or wrap actions here
  // For simplicity, exposing dispatch for now. Can be refactored to expose action methods.
  return context;
}
