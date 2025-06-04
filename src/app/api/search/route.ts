import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Gestionnaire de requête POST pour l'API de recherche
 * Sert de pont entre l'application front-end et le webhook n8n
 */
export async function POST(request: NextRequest) {
  try {
    // Récupérer les données de la requête
    const requestData = await request.json();
    
    // Vérifier si un webhook n8n est configuré
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    
    if (!n8nWebhookUrl) {
      console.warn('Aucune URL de webhook n8n configurée. Utilisation du mode simulation.');
      
      // Mode simulation - retourner des résultats fictifs
      return NextResponse.json({
        results: [
          {
            id: '1',
            title: 'Résultat simulé 1',
            description: `Résultat pour: ${requestData.query}`,
            type: requestData.type,
            category: 'Simulation',
            tags: ['test', 'simulation']
          },
          {
            id: '2',
            title: 'Résultat simulé 2',
            description: `Autre résultat pour: ${requestData.query}`,
            type: requestData.type,
            category: 'Simulation',
            tags: ['test', 'simulation']
          }
        ],
        totalResults: 2,
        executionTime: 0.1,
        requestId: requestData.requestId
      }, { status: 200 });
    }
    
    // Récupérer l'utilisateur actuel si disponible
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    // Ajouter des informations supplémentaires à la requête
    const enrichedRequestData = {
      ...requestData,
      userId: session?.user?.id || null,
      timestamp: Date.now()
    };
    
    // Transférer la requête au webhook n8n
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(enrichedRequestData)
    });
    
    if (!n8nResponse.ok) {
      throw new Error(`Erreur lors de l'appel au webhook n8n: ${n8nResponse.status}`);
    }
    
    // Récupérer et retourner les résultats du webhook n8n
    const n8nData = await n8nResponse.json();
    
    return NextResponse.json(n8nData, { status: 200 });
    
  } catch (error) {
    console.error('Erreur lors du traitement de la recherche:', error);
    
    return NextResponse.json({
      error: 'Une erreur est survenue lors du traitement de la recherche',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}