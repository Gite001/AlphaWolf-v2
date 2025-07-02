'use client';

import { useState, useEffect } from 'react';

export default function PrivacyPage() {
    const [date, setDate] = useState('');

    useEffect(() => {
        setDate(new Date().toLocaleDateString('fr-FR'));
    }, []);

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <h1 className="text-4xl font-bold font-headline mb-4">Politique de Confidentialité</h1>
            <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
                <p>Dernière mise à jour : {date}</p>
                
                <p>Cette Politique de Confidentialité décrit Nos politiques et procédures sur la collecte, l'utilisation et la divulgation de Vos informations lorsque Vous utilisez le Service et Vous informe de Vos droits à la vie privée et de la manière dont la loi Vous protège.</p>

                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">Collecte et Utilisation de Vos Données Personnelles</h2>
                <h3 className="text-xl font-bold font-headline mt-4 mb-2 text-foreground">Types de Données Collectées</h3>
                <p>Lors de l'utilisation de Notre Service, Nous pouvons Vous demander de Nous fournir certaines informations personnellement identifiables qui peuvent être utilisées pour Vous contacter ou Vous identifier. Les informations personnellement identifiables peuvent inclure, mais ne sont pas limitées à : Adresse e-mail, Prénom et nom, Données d'utilisation.</p>
                
                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">Utilisation de Vos Données Personnelles</h2>
                <p>La Société peut utiliser les Données Personnelles aux fins suivantes : Fournir et maintenir notre Service, y compris pour surveiller l'utilisation de notre Service. Gérer Votre Compte : pour gérer Votre inscription en tant qu'utilisateur du Service.</p>

                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">Sécurité de Vos Données Personnelles</h2>
                <p>La sécurité de Vos Données Personnelles est importante pour Nous, mais n'oubliez pas qu'aucune méthode de transmission sur Internet ou méthode de stockage électronique n'est 100% sécurisée. Bien que Nous nous efforcions d'utiliser des moyens commercialement acceptables pour protéger Vos Données Personnelles, Nous ne pouvons garantir leur sécurité absolue.</p>
                
                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">Contactez-Nous</h2>
                <p>Si vous avez des questions sur cette Politique de Confidentialité, Vous pouvez nous contacter par e-mail.</p>
            </div>
        </div>
    );
}
