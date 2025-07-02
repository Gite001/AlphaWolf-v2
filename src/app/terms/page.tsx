'use client';

import { useState, useEffect } from 'react';

export default function TermsPage() {
    const [date, setDate] = useState('');

    useEffect(() => {
        setDate(new Date().toLocaleDateString('fr-FR'));
    }, []);

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <h1 className="text-4xl font-bold font-headline mb-4">Conditions d'Utilisation</h1>
            <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
                <p>Dernière mise à jour : {date}</p>
                
                <p>Veuillez lire attentivement ces conditions d'utilisation avant d'utiliser Notre Service.</p>

                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">Interprétation et Définitions</h2>
                <h3 className="text-xl font-bold font-headline mt-4 mb-2 text-foreground">Interprétation</h3>
                <p>Les mots dont la première lettre est en majuscule ont des significations définies dans les conditions suivantes. Les définitions suivantes auront la même signification, qu'elles apparaissent au singulier ou au pluriel.</p>
                
                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">Reconnaissance</h2>
                <p>Ce sont les Conditions d'Utilisation régissant l'utilisation de ce Service et l'accord qui opère entre Vous et la Société. Ces Conditions d'Utilisation définissent les droits et obligations de tous les utilisateurs concernant l'utilisation du Service.</p>
                <p>Votre accès et votre utilisation du Service sont conditionnés par Votre acceptation et Votre respect de ces Conditions d'Utilisation. Ces Conditions d'Utilisation s'appliquent à tous les visiteurs, utilisateurs et autres personnes qui accèdent ou utilisent le Service.</p>
                
                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">Liens vers d'Autres Sites Web</h2>
                <p>Notre Service peut contenir des liens vers des sites web ou des services tiers qui ne sont pas détenus ou contrôlés par la Société.</p>
                <p>La Société n'a aucun contrôle sur, et n'assume aucune responsabilité pour, le contenu, les politiques de confidentialité ou les pratiques des sites web ou services tiers. Vous reconnaissez et acceptez en outre que la Société ne sera pas responsable, directement ou indirectement, de tout dommage ou perte causé ou présumé être causé par ou en relation avec l'utilisation ou la confiance accordée à un tel contenu, biens ou services disponibles sur ou via de tels sites web ou services.</p>
                
                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">Exclusion de Garantie "TEL QUEL" et "TEL QUE DISPONIBLE"</h2>
                <p>Le Service vous est fourni "TEL QUEL" et "TEL QUE DISPONIBLE" et avec tous les défauts et vices sans garantie d'aucune sorte. Dans la mesure maximale permise par la loi applicable, la Société, en son propre nom et au nom de ses Affiliés et de ses et leurs concédants de licence et fournisseurs de services respectifs, décline expressément toute garantie, qu'elle soit expresse, implicite, légale ou autre, en ce qui concerne le Service...</p>

                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">Contactez-Nous</h2>
                <p>Si vous avez des questions sur ces Conditions d'Utilisation, vous pouvez nous contacter par e-mail.</p>
            </div>
        </div>
    );
}
