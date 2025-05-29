{/* Ce composant analyse la chaîne saisie en temps réel (ou à partir de quelques lettres) pour :

Détecter les mots-clés fréquents

Comprendre l’intention probable (ex. "coiffeur", "réparer téléphone", etc.)

Suggérer une complétion intelligente avec des formulations pertinentes localement
⚙️ Fonctionnement prévu
🔸 Entrée :
Texte partiellement saisi par l’utilisateur

Optionnel : type sélectionné (produit ou service)

🔸 Traitement :
Utilisation du Vercel AI SDK (useCompletion ou streaming)

Prompt optimisé pour retourner 3 à 5 suggestions pertinentes

Requête envoyée dès qu’on détecte une intention incomplète ou floue

🔸 Sortie :
Tableau de suggestions courtes
*/}
