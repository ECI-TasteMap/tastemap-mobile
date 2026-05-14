import apiClient from './apiClient';

export interface AIMessage {
  id: string;
  userId: string;
  userMessage: string;
  aiResponse: string;
  timestamp: string;
}

export interface AIHistoryResponse {
  messages: AIMessage[];
  total: number;
  hasMore: boolean;
}

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord {
  return (typeof value === 'object' && value !== null ? value : {}) as UnknownRecord;
}

function readString(record: UnknownRecord, keys: string[], fallback = ''): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value;
    }
  }
  return fallback;
}

function normalizeMessage(raw: unknown): AIMessage {
  const data = asRecord(raw);
  return {
    id: readString(data, ['id', '_id', 'hist_id'], `${Date.now()}`),
    userId: readString(data, ['userId', 'hist_userId', 'user_id']),
    userMessage: readString(data, ['userMessage', 'message', 'hist_userMessage']),
    aiResponse: readString(data, ['aiResponse', 'response', 'reply', 'hist_aiResponse']),
    timestamp: readString(data, ['timestamp', 'hist_timestamp', 'createdAt'], new Date().toISOString()),
  };
}

class AIService {
  async getHistory(userId: string, limit = 50, offset = 0): Promise<AIHistoryResponse> {
    const response = await apiClient.get('/api/ai/history', {
      params: { userId, limit, offset },
    });

    const root = asRecord(response.data);
    const payload = asRecord(root.data ?? root);

    const rawMessages = payload.messages ?? payload.items ?? payload.history ?? payload.content;
    const messages = Array.isArray(rawMessages) ? rawMessages.map(normalizeMessage) : [];

    const totalCandidate = payload.total ?? payload.totalElements;
    const total = typeof totalCandidate === 'number' ? totalCandidate : messages.length;

    const hasMoreCandidate = payload.hasMore;
    const hasMore =
      typeof hasMoreCandidate === 'boolean' ? hasMoreCandidate : offset + messages.length < total;

    return { messages, total, hasMore };
  }

  async sendMessage(userId: string, userMessage: string): Promise<AIMessage> {
    // Backend expects { message: string } in the request body
    const response = await apiClient.post(`/api/v1/users/${userId}/chat`, {
      message: userMessage,
    });

    const root = asRecord(response.data);
    const payload = asRecord(root.data ?? root);

    const normalized = normalizeMessage({
      ...payload,
      userId: readString(payload, ['userId', 'hist_userId', 'user_id'], userId),
      userMessage: readString(payload, ['userMessage', 'message', 'hist_userMessage'], userMessage),
      aiResponse: readString(
        payload,
        ['aiResponse', 'response', 'reply', 'hist_aiResponse', 'assistantMessage', 'chatResponse'],
        typeof response.data === 'string' ? response.data : ''
      ),
    });

    return normalized;
  }

  async deleteHistory(userId: string): Promise<{ deletedCount?: number; message?: string }> {
    const response = await apiClient.delete('/api/ai/history', {
      params: { userId },
    });

    const root = asRecord(response.data);
    const payload = asRecord(root.data ?? root);

    const deletedCount =
      typeof payload.deletedCount === 'number'
        ? payload.deletedCount
        : typeof payload.count === 'number'
          ? payload.count
          : undefined;

    const message = readString(payload, ['message']);

    return { deletedCount, message };
  }
}

export const aiService = new AIService();
