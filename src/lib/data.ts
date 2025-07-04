import type { Ad, Stat, EngagementData, GeoData } from './types';
import { BarChart, Target, TrendingUp, Users } from 'lucide-react';

// Helper function to generate a random number within a range
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Function to generate dynamic ad data with recent dates
export const getAds = (): Ad[] => {
    const adTemplates = [
      {
        title: 'Cozy Knit Sweater',
        description: "Enveloppez-vous de douceur. Notre pull en maille ultra-confortable, parfait pour les journées fraîches.",
        dataAiHint: 'cozy sweater',
      },
      {
        title: 'Smart Home Hub',
        description: "Centralisez votre maison connectée. Contrôlez lumières, thermostats et plus, simplement avec votre voix.",
        dataAiHint: 'smart home',
      },
      {
        title: 'Organic Skincare Set',
        description: "Révélez votre éclat naturel. Notre coffret de soins bio nourrit et revitalise votre peau en profondeur.",
        dataAiHint: 'skincare set',
      },
      {
        title: 'Portable Blender',
        description: "Vos smoothies frais, où que vous soyez. Notre blender portable est puissant, léger et se recharge par USB.",
        dataAiHint: 'portable blender',
      },
      {
        title: 'Noise-Cancelling Headphones',
        description: "Plongez dans votre monde. Écouteurs à réduction de bruit active pour une immersion sonore totale.",
        dataAiHint: 'headphones music',
      },
      {
        title: 'Yoga Mat & Block Set',
        description: "Trouvez votre équilibre. L'ensemble parfait pour approfondir votre pratique du yoga, avec confort et stabilité.",
        dataAiHint: 'yoga mat',
      },
      {
        title: 'Subscription Box',
        description: "La surprise qui fait plaisir, chaque mois. Découvrez des produits uniques et exclusifs livrés chez vous.",
        dataAiHint: 'subscription box',
      },
      {
        title: 'LED Strip Lights',
        description: "Créez l'ambiance parfaite. Des millions de couleurs pour transformer n'importe quelle pièce, contrôlables.",
        dataAiHint: 'led lights',
      },
    ];

    const platforms: Ad['platform'][] = ['Facebook', 'Instagram', 'TikTok', 'Pinterest'];
    const countries = ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France'];

    return adTemplates.map((template, index) => {
        const date = new Date();
        date.setDate(date.getDate() - random(0, 29)); // Ads from the last 30 days

        return {
            id: (index + 1).toString(),
            title: template.title,
            description: template.description,
            platform: platforms[random(0, platforms.length - 1)],
            imageUrl: 'https://placehold.co/400x400.png',
            dataAiHint: template.dataAiHint,
            engagement: {
                likes: random(5000, 500000),
                comments: random(200, 25000),
                shares: random(100, 40000),
                score: random(70, 95),
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
