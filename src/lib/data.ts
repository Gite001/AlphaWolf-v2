import type { Ad, Stat, EngagementData, GeoData } from './types';
import { BarChart, Target, TrendingUp, Users } from 'lucide-react';

// Helper function to generate a random number within a range
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Function to generate dynamic ad data with recent dates
export const getAds = (): Ad[] => {
    const adTemplates = [
      {
        title: 'Pull en Maille Douillet',
        description: "Enveloppez-vous de douceur. Notre pull en maille ultra-confortable, parfait pour les journées fraîches.",
        dataAiHint: 'cozy sweater',
      },
      {
        title: 'Hub Maison Intelligente',
        description: "Centralisez votre maison connectée. Contrôlez lumières, thermostats et plus, simplement avec votre voix.",
        dataAiHint: 'smart home',
      },
      {
        title: 'Set de Soins Bio',
        description: "Révélez votre éclat naturel. Notre coffret de soins bio nourrit et revitalise votre peau en profondeur.",
        dataAiHint: 'skincare set',
      },
      {
        title: 'Mixeur Portable',
        description: "Vos smoothies frais, où que vous soyez. Notre mixeur portable est puissant, léger et se recharge par USB.",
        dataAiHint: 'portable blender',
      },
      {
        title: 'Écouteurs Anti-Bruit',
        description: "Plongez dans votre monde. Écouteurs à réduction de bruit active pour une immersion sonore totale.",
        dataAiHint: 'headphones music',
      },
      {
        title: 'Set Tapis et Bloc de Yoga',
        description: "Trouvez votre équilibre. L'ensemble parfait pour approfondir votre pratique du yoga, avec confort et stabilité.",
        dataAiHint: 'yoga mat',
      },
      {
        title: 'Box par Abonnement',
        description: "La surprise qui fait plaisir, chaque mois. Découvrez des produits uniques et exclusifs livrés chez vous.",
        dataAiHint: 'subscription box',
      },
      {
        title: 'Bandes Lumineuses LED',
        description: "Créez l'ambiance parfaite. Des millions de couleurs pour transformer n'importe quelle pièce, contrôlables.",
        dataAiHint: 'led lights',
      },
      {
        title: 'Chaise de Bureau Ergonomique',
        description: "Le confort pour vos longues journées de travail. Notre chaise de bureau ergonomique soutient votre dos et améliore votre posture.",
        dataAiHint: 'office chair',
      },
      {
        title: 'Grains de Café Gourmet',
        description: "Commencez votre journée avec l'arôme parfait. Des grains de café d'origine unique, torréfiés à la perfection.",
        dataAiHint: 'coffee beans',
      },
      {
        title: 'Montre d\'Aventure Étanche',
        description: "Conçue pour l'exploration. Une montre robuste, étanche et dotée d'un GPS pour toutes vos aventures.",
        dataAiHint: 'adventure watch',
      },
      {
        title: 'Robot de Cuisine Multifonction',
        description: "Simplifiez votre quotidien en cuisine. Hache, mélange, et cuit à la perfection. L'allié de tous les chefs.",
        dataAiHint: 'kitchen robot',
      },
      {
        title: 'Ensemble de Couteaux de Cuisine Pro',
        description: "La précision d'un chef dans votre cuisine. Acier allemand, tranchant durable. Préparez vos ingrédients comme un pro.",
        dataAiHint: 'kitchen knives',
      }
    ];

    const platforms: Ad['platform'][] = ['Facebook', 'Instagram', 'TikTok', 'Pinterest'];
    const countries = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France'];

    return adTemplates.map((template, index) => {
        const date = new Date();
        date.setDate(date.getDate() - random(0, 365)); // Ads from the last year

        return {
            id: (index + 1).toString(),
            title: template.title,
            description: template.description,
            platform: platforms[random(0, platforms.length - 1)],
            imageUrl: '/images/ad-placeholder.png',
            dataAiHint: template.dataAiHint,
            engagement: {
                likes: random(5000, 500000),
                comments: random(200, 25000),
                shares: random(100, 40000),
                score: random(60, 98),
            },
            date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
            country: countries[random(0, countries.length - 1)],
            productLink: '#',
        };
    });
};

// Function to generate dynamic stats
export const getStats = (): Stat[] => {
    const trackedAdsChange = (random(10, 25) / 10).toFixed(1);
    const winningProductsChange = (random(1, 5) / 10).toFixed(1);
    const topEngagementChange = (random(1, 3) / 10).toFixed(1);
    const newCompetitorsChange = random(2, 8);

    return [
        {
            title: 'Publicités Suivies',
            value: random(12000, 15000).toLocaleString(),
            change: `+${trackedAdsChange}%`,
            changeType: 'increase',
            icon: BarChart,
        },
        {
            title: 'Produits Gagnants',
            value: random(200, 300).toString(),
            change: `+${winningProductsChange}%`,
            changeType: 'increase',
            icon: Target,
        },
        {
            title: 'Engagement Supérieur',
            value: `${random(85, 95)}.${random(0,9)}%`,
            change: `-${topEngagementChange}%`,
            changeType: 'decrease',
            icon: TrendingUp,
        },
        {
            title: 'Nouveaux Concurrents',
            value: random(10, 25).toString(),
            change: `+${newCompetitorsChange} depuis la semaine dernière`,
            changeType: 'increase',
            icon: Users,
        },
    ];
};

// Function to generate dynamic engagement data for the chart
export const getEngagementData = (): EngagementData[] => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const base = {
        Facebook: 2000,
        Instagram: 3000,
        TikTok: 4000,
        Pinterest: 1000
    };
    const growth = {
        Facebook: 300,
        Instagram: 350,
        TikTok: 500,
        Pinterest: 200
    }

    return days.map((day, index) => ({
        date: day,
        Facebook: base.Facebook + (index * growth.Facebook) + random(-200, 200),
        Instagram: base.Instagram + (index * growth.Instagram) + random(-200, 200),
        TikTok: base.TikTok + (index * growth.TikTok) + random(-300, 300),
        Pinterest: base.Pinterest + (index * growth.Pinterest) + random(-150, 150),
    }));
};

// --- Static Data for Geographic Hotspots Chart ---
// Data adjusted to reflect the user's strategic input.
export const geoData: GeoData[] = [
    // Tier 1: USA, Canada, UK, Australia, New Zealand
    { country: 'USA', marketStrength: 95 },
    { country: 'United Kingdom', marketStrength: 92 },
    { country: 'Australia', marketStrength: 90 },
    { country: 'Canada', marketStrength: 88 },
    { country: 'New Zealand', marketStrength: 85 },
    // Tier 2: France, Germany, Spain, Italy
    { country: 'Germany', marketStrength: 80 },
    { country: 'France', marketStrength: 78 },
    { country: 'Spain', marketStrength: 72 },
    { country: 'Italy', marketStrength: 70 },
].sort((a, b) => a.marketStrength - b.marketStrength);
