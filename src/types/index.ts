export interface HeadshotStyle {
  id: string;
  name: string;
  category: 'Corporate' | 'Tech' | 'Natural' | 'Creative' | 'Editorial';
  description: string;
  lighting: string;
  backgroundDescription: string;
  imageThumbnail: string;
  tags: string[];
}

export interface AttireOption {
  id: string;
  name: string;
  description: string;
}

export type AspectRatioType = '1:1' | '3:4' | '4:3' | '16:9';
export type ResolutionType = '1K' | '2K';

export interface GeneratedHeadshot {
  id: string;
  imageUrl: string;
  originalSelfieUrl: string;
  styleId: string;
  styleName: string;
  attireName: string;
  expression: string;
  aspectRatio: AspectRatioType;
  timestamp: number;
  modelUsed: string;
  promptUsed: string;
  version: number;
  history: string[]; // history of image URLs if edited
}
