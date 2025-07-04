# AlphaWolf - Votre Loup du Marketing suralimenté par l'IA

Bienvenue dans AlphaWolf, votre suite d'intelligence marketing tout-en-un. Cette application exploite la puissance de l'IA Gemini de Google via Genkit pour analyser les tendances du marché, déconstruire les stratégies des concurrents, générer des plans marketing complets et produire des concepts publicitaires à fort impact (incluant textes, images générées par IA et audio).

Pour une description complète des fonctionnalités et de la philosophie, veuillez consulter la section **"Guide"** à l'intérieur de l'application en cours d'exécution.

---

## Pour Commencer

Pour lancer l'application sur votre machine locale, suivez ces étapes depuis le répertoire racine de votre projet dans le terminal de Firebase Studio.

**Important :** Une application Next.js est un projet complet, et non un simple script. Vous ne pouvez pas la démarrer en exécutant un seul fichier (par exemple, avec une option comme "Exécuter le fichier actif"). Vous devez utiliser les commandes `npm` ci-dessous pour lancer le serveur de développement qui s'occupe de tout compiler.

1.  **Installer les dépendances (une seule fois) :**
    La commande `npm install` lit le fichier `package.json` et installe toutes les bibliothèques nécessaires. Vous ne devez faire cette étape qu'une seule fois, ou si vous ajoutez de nouvelles bibliothèques au projet.
    ```bash
    npm install
    ```

2.  **Lancer le serveur de développement (à chaque fois) :**
    Cette commande démarre l'application. Vous devrez l'exécuter chaque fois que vous voudrez travailler sur l'application. Le terminal doit rester ouvert pendant que vous l'utilisez.
    ```bash
    npm run dev
    ```
    L'application sera alors disponible à l'adresse `http://localhost:9003`. Maintenez la touche `Ctrl` (ou `Cmd` sur Mac) et cliquez sur le lien pour l'ouvrir dans votre navigateur.

---

## Stack Technologique

-   **Frontend :** [Next.js](https://nextjs.org/) avec React (App Router)
-   **Composants UI :** [ShadCN UI](https://ui.shadcn.com/)
-   **Styling :** [Tailwind CSS](https://tailwindcss.com/)
-   **Intégration IA :** [Genkit](https://firebase.google.com/docs/genkit), le framework officiel de Google.
-   **Modèle IA :** Google [Gemini](https://deepmind.google.com/technologies/gemini/)
-   **Visualisation :** [Recharts](https://recharts.org/)
