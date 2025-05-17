import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, MapPin, Star, Tag, ArrowUpRight } from "lucide-react";

// Définition des types
interface Product {
  id: number;
  imageUrl: string;
  category: string;
  dataSource: string;
  productName: string;
  rating: number;
  seller: string;
  address: string;
  price: string;
}

// Données de produits dynamiques
const productsData: Product[] = [
  {
    id: 1,
    imageUrl: 'https://www.digikala.com/mag/wp-content/uploads/2021/09/smartphones-1.jpg',
    category: 'Électronique',
    dataSource: 'Google Maps',
    productName: 'Samsung Galaxy A020',
    rating: 4.9,
    seller: 'TeMfottorigEllectionique',
    address: 'Baco Djicoronie Aci 2000',
    price: '60.000FCFA',
  },
  {
    id: 2,
    imageUrl: 'https://www.androidauthority.com/wp-content/uploads/2021/07/2021-Best-Smartphones-5.jpg',
    category: 'Mode',
    dataSource: 'Instagram Shop',
    productName: 'T-Shirt Stylé en Coton',
    rating: 4.5,
    seller: 'ChicBoutique',
    address: 'Hippodrome, Rue 224',
    price: '15.000FCFA',
  },
  {
    id: 3,
    imageUrl: 'https://th.bing.com/th/id/OIP.MkayV7PqiS0eVHcLxxQXIAHaE8?w=1920&h=1281&rs=1&pid=ImgDetMain',
    category: 'Maison',
    dataSource: 'Amazon',
    productName: 'Lampe de Bureau LED',
    rating: 4.7,
    seller: 'HomeDecor Plus',
    address: 'Sogoniko, Près du Marché',
    price: '25.000FCFA',
  },
  {
    id: 4,
    imageUrl: 'https://th.bing.com/th/id/OIP.bKuJxidu5Cukfg9vl4qrBQHaEK?w=1280&h=720&rs=1&pid=ImgDetMain',
    category: 'Livres',
    dataSource: 'Librairie Harmattan',
    productName: 'Le Vieux Nègre et la Médaille',
    rating: 4.8,
    seller: 'CultureLivres',
    address: 'Centre-Ville, Avenue K',
    price: '7.500FCFA',
  },
  {
    id: 5,
    imageUrl: 'https://www.techadvisor.com/wp-content/uploads/2023/01/Best-OnePlus-phone.jpg?quality=50&strip=all&w=1024',
    category: 'Sport',
    dataSource: 'Decathlon',
    productName: 'Baskets de Course Pro',
    rating: 4.6,
    seller: 'SportPerform',
    address: 'ACI 2000, Zone Commerciale',
    price: '45.000FCFA',
  },
  {
    id: 6,
    imageUrl: 'https://cdn.mos.cms.futurecdn.net/WqZb7zEo4oZCu9quF72rWJ-1200-80.jpg',
    category: 'Beauté',
    dataSource: 'Yves Rocher',
    productName: 'Crème Hydratante Bio',
    rating: 4.9,
    seller: 'NaturelleBeauté',
    address: 'Badalabougou, Rue Principale',
    price: '12.000FCFA',
  }
];

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.onerror = null;
    target.src = `https://placehold.co/350x192/f0f0f0/333333?text=${encodeURIComponent(product.category)}`;
  };

  return (
    <Card className="w-full bg-white/90 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group p-0 pb-2">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={product.imageUrl || `https://placehold.co/350x192/f0f0f0/333333?text=${encodeURIComponent(product.category)}`}
          alt={product.productName}
          width={350}
          height={192}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={handleError}
          priority={product.id <= 3}
        />
        <div className="absolute top-2 left-2 flex place-items-center gap-1.5">
          <span className="px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {product.category}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6  backdrop-blur-sm text-xs font-medium text-white  rounded-full px-2 flex items-center gap-1 shadow-sm"
          >
            <Cloud className="w-3 h-3" />
            {product.dataSource}
          </Button>
        </div>
      </div>

      <CardHeader className="px-3 py-0">
        <div className="flex items-start justify-between gap-2">
          <CardDescription className="text-base font-semibold text-gray-900 leading-tight">
            {product.productName}
          </CardDescription>
          <div className="flex items-center gap-0.5 text-yellow-400 flex-shrink-0 bg-yellow-50 px-1.5 py-0.5 rounded-full">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-medium text-gray-700">{product.rating}</span>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-600">Vendu par <span className="font-medium text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">{product.seller}</span></p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{product.address}</span>
          </p>
        </div>
      </CardHeader>

      <CardContent className="px-3 py-0 flex items-center justify-between border-t border-gray-100">
        <div className="text-base font-bold text-gray-900">{product.price}</div>
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

const ProductResultats: React.FC = () => {
  if (!productsData || productsData.length === 0) {
    return <p className="text-center text-gray-500">Aucun produit à afficher.</p>;
  }

  return (
    <div className="p-3 md:p-6 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
        {productsData.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductResultats;
