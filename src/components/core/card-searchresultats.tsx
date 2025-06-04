import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, MapPin, Star, Tag, ArrowUpRight } from "lucide-react";
import { SearchResult } from "@/hooks/use-search";

// Adapter l'interface SearchResult pour notre affichage
interface ProductCardProps {
  product: SearchResult;
}

// Fonction pour mapper un SearchResult vers un format d'affichage
const mapResultToProduct = (result: SearchResult) => {
  return {
    id: result.id,
    imageUrl: result.image || '',
    category: result.category || result.type || 'Produit',
    dataSource: result.tags?.[0] || 'Web',
    productName: result.title,
    rating: result.rating || 4.5,
    seller: result.tags?.[1] || 'Vendeur',
    address: 'À proximité',
    price: result.price || 'N/A',
    description: result.description
  };
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Mapper le résultat pour l'affichage
  const displayProduct = mapResultToProduct(product);
  
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = `https://placehold.co/350x192/f0f0f0/333333?text=${encodeURIComponent(displayProduct.category)}`;
  };

  // Correction: priorité pour les 3 premiers éléments (id numérique)
  let isPriority = false;
  if (typeof displayProduct.id === 'number') {
    isPriority = displayProduct.id <= 3;
  }

  return (
    <Card className="w-full bg-white/90 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group p-0 pb-2">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={displayProduct.imageUrl || `https://placehold.co/350x192/f0f0f0/333333?text=${encodeURIComponent(displayProduct.category)}`}
          alt={displayProduct.productName}
          width={350}
          height={192}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={handleError}
          priority={isPriority}
        />
        <div className="absolute top-2 left-2 flex place-items-center gap-1.5">
          <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {displayProduct.category}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6  backdrop-blur-sm text-xs font-medium text-white  rounded-full px-2 flex items-center gap-1 shadow-sm"
          >
            <Cloud className="w-3 h-3" />
            {displayProduct.dataSource}
          </Button>
        </div>
      </div>

      <CardHeader className="px-3 py-0">
        <div className="flex items-start justify-between gap-2">
          <CardDescription className="text-base font-semibold text-gray-900 leading-tight">
            {displayProduct.productName}
          </CardDescription>
          <div className="flex items-center gap-0.5 text-yellow-400 flex-shrink-0 bg-yellow-50 px-1.5 py-0.5 rounded-full">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-medium text-gray-700">{displayProduct.rating}</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-600">Vendu par <span className="font-medium text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">{displayProduct.seller}</span></p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{displayProduct.address}</span>
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-3 py-0 flex items-center justify-between border-t border-gray-100">
        <div className="text-base font-bold text-gray-900">{displayProduct.price}</div>
        <Button
          size="sm"
          aria-label="Voir le produit"
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-8 h-8 p-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
        >
          <ArrowUpRight className="w-3 h-3" />
        </Button>
      </CardContent>
    </Card>
  );
};

interface SearchResultatsProps {
  results: SearchResult[];
  isLoading?: boolean;
}

const SearchResultats: React.FC<SearchResultatsProps> = ({ results, isLoading = false }) => {
  // Créer une variable pour l'affichage
  const displayProduct = results || [];
  
  if (isLoading) {
    return <p className="text-center text-gray-500">Chargement des résultats...</p>;
  }
  
  if (!displayProduct || displayProduct.length === 0) {
    return <p className="text-center text-gray-500">Aucun produit à afficher.</p>;
  }

  return (
    <div className="p-3 md:p-6 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3">
        {displayProduct.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export { SearchResultats, ProductCard };
export type { SearchResultatsProps };
