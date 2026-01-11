import { API_BASE_URL } from '../config/api';
import { authUtils } from './auth';

export const sendMessageStream = async (message, onChunk, onComplete, onError) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authUtils.getAuthHeaders()
      },
      credentials: 'include',
      body: JSON.stringify({ message })
    });

    if (!response.ok) throw new Error('Failed to get AI response');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          
          if (data === '[DONE]') {
            onComplete?.();
            return;
          }

          try {
            const parsed = JSON.parse(data);
            if (parsed.error) throw new Error(parsed.error);
            if (parsed.chunk) onChunk(parsed.chunk);
          } catch (parseError) {
            // Ignore parse errors
          }
        }
      }
    }
  } catch (error) {
    onError?.(error);
  }
};

export const resetChatSession = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authUtils.getAuthHeaders()
      },
      credentials: 'include'
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    return false;
  }
};

export const getRecommendations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authUtils.getAuthHeaders()
      },
      credentials: 'include'
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to get recommendations');
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const generateIcebreaker = async (matchId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/icebreaker`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authUtils.getAuthHeaders()
      },
      credentials: 'include',
      body: JSON.stringify({ matchId })
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.message || 'Failed to generate icebreaker');
    return data.data.message;
  } catch (error) {
    throw error;
  }
};

export const aiService = {
  sendMessageStream,
  resetChatSession,
  getRecommendations,
  generateIcebreaker
};

export default aiService;
