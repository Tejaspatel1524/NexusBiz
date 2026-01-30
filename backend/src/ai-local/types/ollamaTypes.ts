/**
 * TypeScript interfaces for Ollama AI integration
 */

export interface OllamaConfig {
    baseUrl: string;
    defaultModel: string;
    timeout: number;
    maxRetries: number;
    temperature: number;
    streamingEnabled: boolean;
}

export interface OllamaRequest {
    model: string;
    prompt: string;
    system?: string;
    template?: string;
    context?: number[];
    stream?: boolean;
    raw?: boolean;
    format?: 'json';
    options?: {
        temperature?: number;
        top_p?: number;
        top_k?: number;
        num_predict?: number;
        num_ctx?: number; // context window size
        repeat_penalty?: number;
    };
}

export interface OllamaResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
    context?: number[];
    total_duration?: number;
    load_duration?: number;
    prompt_eval_count?: number;
    eval_count?: number;
}

export interface OllamaStreamResponse {
    model: string;
    created_at: string;
    response: string;
    done: boolean;
    context?: number[];
    total_duration?: number;
    load_duration?: number;
    prompt_eval_count?: number;
    eval_count?: number;
}

export interface OllamaChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface OllamaChatRequest {
    model: string;
    messages: OllamaChatMessage[];
    stream?: boolean;
    options?: OllamaRequest['options'];
}

export interface OllamaChatResponse {
    model: string;
    created_at: string;
    message: OllamaChatMessage;
    done: boolean;
}

export interface OllamaEmbeddingRequest {
    model: string;
    prompt: string;
}

export interface OllamaEmbeddingResponse {
    embedding: number[];
}

export interface OllamaModel {
    name: string;
    modified_at: string;
    size: number;
    digest: string;
}

export interface OllamaModelsResponse {
    models: OllamaModel[];
}

export enum TaskType {
    IDEA_GENERATION = 'idea_generation',
    MARKET_ANALYSIS = 'market_analysis',
    FINANCIAL_PROJECTIONS = 'financial_projections',
    MARKETING_STRATEGY = 'marketing_strategy',
    OPERATIONS_PLANNING = 'operations_planning',
    LEGAL_COMPLIANCE = 'legal_compliance',
    RISK_ANALYSIS = 'risk_analysis',
    HR_PLANNING = 'hr_planning',
    TECHNOLOGY_REQUIREMENTS = 'technology_requirements',
    IMPLEMENTATION_TIMELINE = 'implementation_timeline',
    QUICK_CHAT = 'quick_chat',
    CONTENT_REFINEMENT = 'content_refinement',
    CODE_GENERATION = 'code_generation',
    COMPLEX_REASONING = 'complex_reasoning'
}

export interface ModelCapability {
    model: string;
    tasks: TaskType[];
    contextWindow: number;
    speedTier: 'fast' | 'medium' | 'slow';
    qualityTier: 'high' | 'medium' | 'low';
    description: string;
}

export interface PerformanceStats {
    avgTime: number;
    successRate: number;
    totalRequests: number;
}

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

export interface ConversationContext {
    conversationId: string;
    messages: Message[];
    currentIdea?: any;
    currentBusinessPlan?: any;
    userPreferences?: any;
    metadata: {
        createdAt: Date;
        lastUpdated: Date;
        totalMessages: number;
    };
}

export interface CacheEntry {
    key: string;
    value: string;
    createdAt: Date;
    expiresAt: Date;
    hits: number;
}

export interface Document {
    id: string;
    content: string;
    embedding: number[];
    metadata: {
        source: string;
        type: 'template' | 'knowledge' | 'example';
        industry?: string;
        section?: string;
        createdAt: Date;
    };
}
