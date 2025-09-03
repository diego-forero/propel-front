import type { Category, Question, CategoryStat, ResponseRow, ParticipantInput, NeedInput } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
}

export const api = {
  async getCategories(): Promise<Category[]> {
    return fetchJson('/categories');
  },
  async getQuestions(): Promise<Question[]> {
    return fetchJson('/questions');
  },
  async getCategoryStats(): Promise<CategoryStat[]> {
    return fetchJson('/stats/categories');
  },
  async getResponses(): Promise<ResponseRow[]> {
    return fetchJson('/responses');
  },
  async registerParticipant(data: ParticipantInput): Promise<any> {
    return fetchJson('/participants/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async createNeed(data: NeedInput): Promise<any> {
    return fetchJson('/needs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
