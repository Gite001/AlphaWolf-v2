## Prompt de Recréation d'Application : AlphaWolf (AdInsights)

Vous êtes un expert en développement d'applications web full-stack. Votre mission est de recréer l'application "AlphaWolf" (nom de code "AdInsights"), une suite d'intelligence marketing complète pilotée par l'IA.

### 1. Spécifications Techniques Fondamentales

- **Framework Principal** : Next.js 15+ avec le **App Router**.
- **Langage** : TypeScript.
- **UI Components** : **ShadCN UI**. Utilisez les composants existants (`@/components/ui`) autant que possible.
- **Styling** : **Tailwind CSS**.
- **Icônes** : **Lucide React**. Assurez-vous que les icônes utilisées existent bien dans la librairie.
- **Charts & Visualisations** : **Recharts**, intégrés via les composants ShadCN UI.
- **Intégration IA** : **Genkit** (avec le plugin `@genkit-ai/googleai`) pour toutes les fonctionnalités d'IA. Le modèle par défaut est `gemini-1.5-flash`.
- **APIs Externes** : **SerpApi** pour la recherche web en temps réel (la clé API sera fournie dans un fichier `.env`).
- **Internationalisation (i18n)** : L'application doit supporter le français (`fr`) et l'anglais (`en`) via des fichiers JSON (`/src/messages/*.json`). Une logique de traduction doit être implémentée via un `I18nProvider` et un hook `useI18n`.

### 2. Identité Visuelle et Style (Branding)

- **Nom de l'application** : AlphaWolf
- **Philosophie** : Agressif, stratégique, axé sur la domination du marché. Pensez "chef de meute".
- **Palette de couleurs** :
    - **Primaire** : Orange Vif (utilisé pour les CTA et les accents importants).
    - **Fond** : Thème sombre (type "slate-950").
    - **Cartes & Éléments UI** : Arrière-plans semi-transparents avec un effet de flou (`backdrop-blur-sm`).
    - **Accents Secondaires** : Violet et Orange pour les éléments décoratifs en arrière-plan (dégradés radiaux).
- **Typographie** : Une police sans-serif moderne et lisible (par exemple, Inter).

### 3. Structure des Fichiers et Pages

Créez une application Next.js avec la structure de pages suivante dans le répertoire `/src/app/` :

- `/` : Page d'accueil (Landing Page).
- `/dashboard` : Tableau de bord principal.
- `/plan` : Générateur de Plan Marketing.
- `/finder` : Outil de Découverte de Produits Gagnants.
- `/ad-radar` : Radar d'Annonces en Direct.
- `/trends` : Analyse des Tendances du Marché.
- `/pulse` : Pouls des Places de Marché (Amazon, etc.).
- `/spy` : Analyse de Concurrents (via URL).
- `/takedown` : Générateur de Plan de Conquête (Offensif).
- `/generate` : Générateur de Concepts Publicitaires (Texte + Image + Audio).
- `/video` : Générateur de Storyboard Vidéo.
- `/analyze` : Analyse de Performance d'une Publicité existante.
- `/lexicon` : Lexique des Termes Publicitaires.
- `/guide` : Guide complet de l'application.
- `/terms`, `/privacy` : Pages légales statiques.

### 4. Spécifications Détaillées des Fonctionnalités

Pour chaque page, implémentez un formulaire, une action serveur Next.js (`actions.ts`), et un composant pour afficher les résultats.

#### **Flux Genkit (dans `/src/ai/flows/`)**

Créez un flux Genkit pour chaque fonctionnalité IA. Chaque flux doit :
- Avoir un schéma d'entrée et de sortie Zod.
- Exposer une fonction wrapper `async`.
- Gérer les locales `fr` et `en`.
- Être importé dans `src/ai/dev.ts`.

1.  **`analyze-ad-performance.ts`**:
    - **Input**: Texte pub, image (Data URI), audience, type de produit.
    - **Output**: Score d'engagement (0-1), prédiction, forces, faiblesses, suggestions.

2.  **`analyze-competitor-ad.ts`**:
    - **Input**: URL du concurrent ou contenu HTML.
    - **Logique**: Utilise une fonction `fetchUrlContent` pour récupérer le HTML. Gère les erreurs (ex: pages JS-dépendantes).
    - **Output**: Nom produit, fonctionnalités, audience, angle marketing, score performance, forces, faiblesses, contre-stratégies.

3.  **`analyze-market-trends.ts`**:
    - **Input**: Catégorie de produit, région.
    - **Logique**: Utilise un **outil Genkit** (`searchWebForRecentTrends`) qui appelle l'API SerpApi (Google Search) pour obtenir des données fraîches.
    - **Output**: Résumé marché, produits tendances, opportunités de niche, risques, analyse géo-spatiale.

4.  **`analyze-marketplace-trends.ts`**:
    - **Input**: Place de marché (Amazon, etc.), catégorie, région.
    - **Output**: Résumé, produits tendances, conseils spécifiques à la plateforme, pièges courants, graphique de tendance de la demande sur 6 mois.

5.  **`define-ad-term.ts`**:
    - **Input**: Terme marketing.
    - **Output**: Définition claire, conseil stratégique "AlphaWolf".

6.  **`find-live-ads.ts`**:
    - **Input**: Requête de recherche, pays.
    - **Logique**: Appelle l'API SerpApi (Google Ads) pour trouver des annonces actives.
    - **Output**: Tableau d'objets `LiveAd` (titre, description, plateforme, score IA).

7.  **`find-winning-products.ts`**:
    - **Input**: Requête, pays.
    - **Logique**: Appelle l'API SerpApi (Google Search) et analyse les résultats organiques.
    - **Output**: Aperçu du marché, liste de catégories gagnantes avec analyse détaillée.

8.  **`generate-ad-copy.ts`**:
    - **Input**: Nom produit, description, audience, mots-clés.
    - **Logique**: Génère d'abord 3 variations de texte. Ensuite, pour chaque variation, génère en parallèle une image (`gemini-2.0-flash-preview-image-generation`) et un fichier audio (`gemini-2.5-flash-preview-tts`).
    - **Output**: Tableau de 3 variations avec `headline`, `body`, `cta`, `imageUrl`, et `audioUrl`.

9.  **`generate-marketing-plan.ts`**:
    - **Input**: Nom produit, description, audience, budget, objectif.
    - **Output**: Analyse d'audience, stratégie de plateforme, messages clés, stratégie d'influence, feuille de route en 3 phases.

10. **`generate-takedown-plan.ts`**:
    - **Input**: URL concurrent, nom de votre produit.
    - **Logique**: Récupère le contenu de l'URL, génère 3 angles d'attaque textuels, puis génère une image pour chaque angle.
    - **Output**: Nom du produit/marque concurrent, 3 angles d'attaque avec `headline`, `body`, `visualPrompt`, et `imageUrl`.

11. **`generate-video-storyboard.ts`**:
    - **Input**: Nom produit, description, audience, style vidéo.
    - **Logique**: Génère la structure textuelle du storyboard (3-5 scènes). Puis, génère en parallèle l'audio pour le script complet et une image pour chaque scène.
    - **Output**: Titre, script complet, `audioUrl`, et un tableau de scènes avec `script_narration`, `visual_description`, `duration` et `imageUrl`.

12. **`summarize-dashboard-data.ts`**:
    - **Input**: Données de statistiques et d'engagement.
    - **Output**: Un résumé de 2-3 phrases et 2-3 conseils stratégiques.

#### **Composants d'Interface (dans `/src/components/`)**

- **Layout (`/layout`)**: Créez une `AppSidebar` (barre latérale de navigation), `AppHeader`, et `AppFooter`. La sidebar doit être responsive et se replier en mode icônes sur desktop.
- **Dashboard (`/dashboard`)**:
    - `StatsCards` pour les KPIs.
    - `EngagementChart` (Bar Chart) et `PlatformDistributionChart` (Pie Chart).
    - `AdGallery` et `AdTable` pour afficher une liste d'annonces fictives. La galerie doit avoir des filtres (recherche, plateforme, date).
    - `DashboardSummary` pour afficher le résumé de l'IA.
- **Pour chaque fonctionnalité** : Créez des composants de formulaire et de résultats dédiés (ex: `plan-form.tsx`, `plan-results.tsx`). Les résultats doivent être visuellement riches, en utilisant des cartes, des icônes, et des graphiques lorsque c'est pertinent.

### 5. Configuration et Fichiers Clés

- **`package.json`**: Inclure `next`, `react`, `genkit`, `@genkit-ai/googleai`, `zod`, `tailwindcss`, `lucide-react`, `recharts`, `shadcn-ui` (via ses dépendances comme `@radix-ui/*`), `serpapi`.
- **`tailwind.config.ts`**: Configurer les couleurs, polices et autres variables de thème.
- **`src/app/globals.css`**: Définir les variables CSS pour le thème ShadCN.
- **`src/lib/data.ts`**: Créer des données fictives pour le tableau de bord (annonces, statistiques, etc.).
- **`.env`**: Préparer le fichier pour la variable `SERPAPI_API_KEY`.

Le but final est une application web entièrement fonctionnelle, robuste, esthétiquement cohérente et qui remplit toutes les spécifications ci-dessus. Procédez de manière structurée, en construisant la base, puis chaque fonctionnalité l'une après l'autre.
