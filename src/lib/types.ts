export type Ad = {
  id: string;
  title: string;
  platform: 'Facebook' | 'Instagram' | 'TikTok' | 'Pinterest';
  imageUrl: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    score: number;
  };
  date: string;
  country: string;
  productLink: string;
  dataAiHint: string;
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
