"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

interface ApplicationGalleryProps {
    applicationRef : React.RefObject<HTMLDivElement | null>;
    setApplicationOpen : (open: boolean) => void;   
}

interface ApplicationItem {
    name: string;
    icon: string;
    url: string;
}

export default function ApplicationGallery({ applicationRef, setApplicationOpen } : ApplicationGalleryProps) {
    // État pour gérer le montage du composant (pour éviter les erreurs d'hydratation)
    const [isMounted, setIsMounted] = useState(false);
    
    // Effet pour marquer le composant comme monté après le rendu initial
    useEffect(() => {
        setIsMounted(true);
    }, []);
    
    // Liste des applications à afficher
    const applications: ApplicationItem[] = [
        { name: "Telegramme", icon: "/imagicon/telegramme.svg?height=60&width=60", url: "https://nextjs.org" },
        { name: "Whatsapp", icon: "/imagicon/whatsapp.svg?height=60&width=60", url: "https://reactjs.org" },
    ];

    // Si le composant n'est pas monté, ne rien rendre pour éviter les erreurs d'hydratation
    if (!isMounted) return null;

    return (
        <div
            ref={applicationRef}
            className="fixed left-4 top-16 w-72 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden z-50 border border-gray-200 dark:border-gray-800 animate-in slide-in-from-top-5 duration-200"
        >
            <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Continuer vos recherches avec</h3>
                <button 
                    onClick={() => setApplicationOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 p-3">
                {applications.map((app, index) => (
                    <a 
                        key={index} 
                        href={app.url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setApplicationOpen(false)}
                    >
                        <div className="relative h-16 w-16 mb-2">
                            <Image src={app.icon} alt={`${app.name} Logo`} fill className="object-contain" />
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{app.name}</span>
                    </a>
                ))}
            </div>
        </div>
    )
}