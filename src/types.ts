export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Question {
  id: number;
  prompt: string;
  createdAt: string;
}

export interface CategoryStat {
  name: string;
  slug: string;
  count: number;
}

export interface ResponseRow {
  id: number;
  description: string;
  created_at: string;
  question: string;
  participant_name: string;
  participant_email: string;
  category_name: string | null;
  category_slug: string | null;
}

export interface ParticipantInput {
  name: string;
  email: string;
  age?: number;
  country?: string;
  city?: string;
  neighborhood?: string;
  phone?: string;
}

export interface NeedInput {
  email: string;
  questionId: number;
  categorySlug?: string;
  description: string;
}