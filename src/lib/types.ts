export type Ad = {
  id: string;
  title: string;
  description: string;
  platform: 'Facebook' | 'Instagram' | 'TikTok' | 'Pinterest';
  imageUrl: string;
  dataAiHint: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    score: number;
  };
  date: string;
  country: string;
  productLink: string;
};

export type Stat = {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
  icon: React.ElementType;
};

export type EngagementData = {
  date: string;
  Facebook: number;
  Instagram: number;
  TikTok: number;
  Pinterest: number;
};

export const supportedMarketplaces = ['Aliexpress', 'Etsy'] as const;

export type GeoData = {
  country: string;
  marketStrength: number;
};
