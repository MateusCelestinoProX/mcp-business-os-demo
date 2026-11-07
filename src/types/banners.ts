export type BannerType = 'exit_intent' | 'onboarding' | 'floating_bar';
export type BannerFrequency = 'once_per_session' | 'once_per_user' | 'always';
export type BannerTheme = 'cyber_red' | 'gold_vip' | 'emerald_stealth' | 'dark_minimal';

export interface SmartBanner {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  type: BannerType;
  targetPages: string[];
  ctaText: string;
  ctaUrl: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  discountCode?: string;
  imageUrl?: string;
  badge?: string;
  isActive: boolean;
  delaySeconds: number;
  frequency: BannerFrequency;
  theme: BannerTheme;
  createdAt: string;
  updatedAt: string;
}

export interface BannersConfig {
  banners: SmartBanner[];
  globalEnabled: boolean;
  exitIntentSensitivity: 'low' | 'medium' | 'high';
}
