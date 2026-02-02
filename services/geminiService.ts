
import { API_BASE_URL } from '../constants';

export const streamGeminiResponse = async (history, newMessage) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ history, newMessage }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Bilinmeyen bir hata oluştu.' }));
      throw new Error(errorData.error || 'Backend Gemini ile iletişim kuramadı.');
    }

    // Read the streamed response
    const reader = response.body?.getReader();
    if (!reader) throw new Error('Yanıt akışı okunamadı.');

    return { 
      text: '',
      async *[Symbol.asyncIterator]() {
        const decoder = new TextDecoder();
        let buffer = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          let newlineIndex;
          while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
            const line = buffer.substring(0, newlineIndex).trim();
            buffer = buffer.substring(newlineIndex + 1);
            if (line) {
              try {
                const json = JSON.parse(line);
                yield json.text; 
              } catch (e) {
                console.warn('Stream parse error:', e);
              }
            }
          }
        }
        if (buffer) { // Kalan son parça
          try {
            const json = JSON.parse(buffer.trim());
            yield json.text;
          } catch (e) {
            console.warn('Final buffer parse error:', e);
          }
        }
      }
    };
  } catch (error) {
    console.error("IronCoach Connection Error:", error);
    throw error;
  }
};
