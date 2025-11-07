
export enum Relationship {
  Business = '비즈니스',
  Friend = '친구',
  Family = '가족',
}

export interface Contact {
  id: string;
  name: string;
  affiliation: string;
  relationship: Relationship;
  interests: string[];
  allergies?: string[];
  importantDates: {
    birthday?: string;
    promotionDate?: string;
    weddingAnniversary?: string;
  };
  giftHistory: { date: string; gift: string }[];
  lastContactDate: string;
}

export interface GiftRecommendation {
  itemName: string;
  category: string;
  reason: string;
}
