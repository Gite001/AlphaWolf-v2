import type { Ad, Stat, EngagementData } from './types';
import { BarChart, Target, TrendingUp, Users } from 'lucide-react';

// --- Static Data for Ads Library ---
export const ads: Ad[] = [
  {
    id: '1',
    title: 'Cozy Knit Sweater',
    description: "Enveloppez-vous de douceur. Notre pull en maille ultra-confortable, parfait pour les journées fraîches.",
    platform: 'Pinterest',
    imageUrl: 'https://placehold.co/400x400.png',
    dataAiHint: 'cozy sweater',
    engagement: { likes: 12000, comments: 450, shares: 1200, score: 92 },
    date: '2023-10-26',
    country: 'USA',
    productLink: '#',
  },
  {
    id: '2',
    title: 'Smart Home Hub',
    description: "Centralisez votre maison connectée. Contrôlez lumières, thermostats et plus, simplement avec votre voix.",
    platform: 'Facebook',
    imageUrl: 'https://placehold.co/400x400.png',
    dataAiHint: 'smart home',
    engagement: { likes: 8500, comments: 1200, shares: 900, score: 90 },
    date: '2023-10-25',
    country: 'UK',
    productLink: '#',
  },
  {
    id: '3',
    title: 'Organic Skincare Set',
    description: "Révélez votre éclat naturel. Notre coffret de soins bio nourrit et revitalise votre peau en profondeur.",
    platform: 'Instagram',
    imageUrl: 'https://placehold.co/400x400.png',
    dataAiHint: 'skincare set',
    engagement: { likes: 25000, comments: 3500, shares: 2000, score: 88 },
    date: '2023-10-24',
    country: 'Canada',
    productLink: '#',
  },
  {
    id: '4',
    title: 'Portable Blender',
    description: "Vos smoothies frais, où que vous soyez. Notre blender portable est puissant, léger et se recharge par USB.",
    platform: 'TikTok',
    imageUrl: 'https://placehold.co/400x400.png',
    dataAiHint: 'portable blender',
    engagement: { likes: 500000, comments: 15000, shares: 25000, score: 85 },
    date: '2023-10-23',
    country: 'Australia',
    productLink: '#',
  },
  {
    id: '5',
    title: 'Noise-Cancelling Headphones',
    description: "Plongez dans votre monde. Écouteurs à réduction de bruit active pour une immersion sonore totale.",
    platform: 'Facebook',
    imageUrl: 'https://placehold.co/400x400.png',
    dataAiHint: 'headphones music',
    engagement: { likes: 7200, comments: 800, shares: 500, score: 82 },
    date: '2023-10-22',
    country: 'Germany',
    productLink: '#',
  },
  {
    id: '6',
    title: 'Yoga Mat & Block Set',
    description: "Trouvez votre équilibre. L'ensemble parfait pour approfondir votre pratique du yoga, avec confort et stabilité.",
    platform: 'Pinterest',
    imageUrl: 'https://placehold.co/400x400.png',
    dataAiHint: 'yoga mat',
    engagement: { likes: 18000, comments: 600, shares: 2500, score: 80 },
    date: '2023-10-21',
    country: 'USA',
    productLink: '#',
  },
  {
    id: '7',
    title: 'Subscription Box',
    description: "La surprise qui fait plaisir, chaque mois. Découvrez des produits uniques et exclusifs livrés chez vous.",
    platform: 'Instagram',
    imageUrl: 'https://placehold.co/400x400.png',
    dataAiHint: 'subscription box',
    engagement: { likes: 32000, comments: 2800, shares: 1500, score: 79 },
    date: '2023-10-20',
    country: 'UK',
    productLink: '#',
  },
  {
    id: '8',
    title: 'LED Strip Lights',
    description: "Créez l'ambiance parfaite. Des millions de couleurs pour transformer n'importe quelle pièce, contrôlables.",
    platform: 'TikTok',
    imageUrl: 'https://placehold.co/400x400.png',
    dataAiHint: 'led lights',
    engagement: { likes: 800000, comments: 25000, shares: 40000, score: 75 },
    date: '2023-10-19',
    country: 'USA',
    productLink: '#',
  },
];


// --- Dynamic Data Generation for Dashboard ---

// Helper function to generate a random number within a range
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Function to generate dynamic stats
const generateStats = (): Stat[] => {
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
const generateEngagementData = (): EngagementData[] => {
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

// Export the dynamically generated data
export const stats: Stat[] = generateStats();
export const engagementData: EngagementData[] = generateEngagementData();
