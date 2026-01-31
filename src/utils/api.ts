/**
 * API Service for connecting to backend
 * Uses relative URLs that work on both localhost and Vercel
 */

// Use relative URL - works on localhost (via Vite proxy) and Vercel (serverless functions)
const API_BASE_URL = '/api';

export interface BusinessIdeaFromAPI {
    id: string;
    title: string;
    description: string;
    industry: string;
    difficultyScore: number;
    investmentNeeded: string;
    potentialROI: string;
    timeline: string;
    oneLiner?: string;
    targetMarket?: string;
    uniqueValue?: string;
}

export interface SSEMessage {
    type: 'progress' | 'complete' | 'error' | 'chunk' | 'done';
    message?: string;
    data?: any;
    chunk?: string;
}

/**
 * Generate business ideas using Ollama AI (Simple REST, no SSE streaming)
 */
export async function generateIdeas(
    inputs: any,
    onProgress?: (message: string) => void
): Promise<BusinessIdeaFromAPI[]> {
    console.log('Calling simple REST API for idea generation...');

    if (onProgress) {
        onProgress('Sending request to AI...');
    }

    try {
        const response = await fetch(`${API_BASE_URL}/ai/ollama/simple-generate-ideas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputs),
        });

        if (onProgress) {
            onProgress('Processing AI response...');
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }

        if (!data.success) {
            throw new Error(data.error || 'Generation failed');
        }

        const ideas = data.ideas || [];
        console.log(`Received ${ideas.length} ideas from API`);

        return ideas;
    } catch (error: any) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Generate full business plan using Ollama AI
 */
export async function generateBusinessPlan(
    idea: any,
    userInputs: any,
    onProgress?: (message: string) => void
): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/ai/ollama/business-plan`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
        },
        body: JSON.stringify({ idea, userInputs }),
    });

    if (!response.ok) {
        throw new Error(`Failed to generate business plan: ${response.statusText}`);
    }

    return new Promise((resolve, reject) => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let businessPlan: any = null;

        if (!reader) {
            reject(new Error('No response body'));
            return;
        }

        const readStream = async () => {
            try {
                while (true) {
                    const { done, value } = await reader.read();

                    if (done) break;

                    const text = decoder.decode(value, { stream: true });
                    const lines = text.split('\n').filter(line => line.startsWith('data: '));

                    for (const line of lines) {
                        try {
                            const jsonStr = line.replace('data: ', '');
                            const message: SSEMessage = JSON.parse(jsonStr);

                            if (message.type === 'progress' && onProgress) {
                                onProgress(message.message || 'Processing...');
                            } else if (message.type === 'complete') {
                                businessPlan = message.data;
                            } else if (message.type === 'error') {
                                throw new Error(message.message || 'Generation failed');
                            }
                        } catch (e) {
                            // Skip non-JSON lines
                        }
                    }
                }
                resolve(businessPlan);
            } catch (error) {
                reject(error);
            }
        };

        readStream();
    });
}

/**
 * Chat with AI assistant
 */
export async function chat(
    conversationId: string,
    message: string,
    context?: any,
    onChunk?: (chunk: string) => void
): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/ai/ollama/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
            conversationId,
            message,
            context,
            streaming: true,
        }),
    });

    if (!response.ok) {
        throw new Error(`Chat failed: ${response.statusText}`);
    }

    return new Promise((resolve, reject) => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        if (!reader) {
            reject(new Error('No response body'));
            return;
        }

        const readStream = async () => {
            try {
                while (true) {
                    const { done, value } = await reader.read();

                    if (done) break;

                    const text = decoder.decode(value, { stream: true });
                    const lines = text.split('\n').filter(line => line.startsWith('data: '));

                    for (const line of lines) {
                        try {
                            const jsonStr = line.replace('data: ', '');
                            const message: SSEMessage = JSON.parse(jsonStr);

                            if (message.type === 'chunk' && onChunk) {
                                fullResponse += message.chunk || '';
                                onChunk(message.chunk || '');
                            } else if (message.type === 'done') {
                                // Stream complete
                            } else if (message.type === 'error') {
                                throw new Error(message.message || 'Chat failed');
                            }
                        } catch (e) {
                            // Skip non-JSON lines
                        }
                    }
                }
                resolve(fullResponse);
            } catch (error) {
                reject(error);
            }
        };

        readStream();
    });
}

/**
 * Check Ollama health status
 */
export async function checkHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/ai/ollama/health`);
        const data = await response.json();
        return data.healthy === true;
    } catch {
        return false;
    }
}

/**
 * Get AI service statistics
 */
export async function getStats(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/ai/ollama/stats`);
    return response.json();
}

export default {
    generateIdeas,
    generateBusinessPlan,
    chat,
    checkHealth,
    getStats,
};
