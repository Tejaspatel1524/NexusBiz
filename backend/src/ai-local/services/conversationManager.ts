import OllamaClient from './ollamaClient';
import { ModelRouter, TaskType } from './modelRouter';
import logger from '../../middleware/logger';
import { Message, ConversationContext } from '../types/ollamaTypes';
import { GENERAL_ASSISTANT_SYSTEM } from '../prompts/systemPrompts';

/**
 * Conversation Manager for multi-turn conversations
 * Manages chat history, context, and state
 */
class ConversationManager {
  private ollamaClient: OllamaClient;
  private modelRouter: ModelRouter;
  private conversations: Map<string, ConversationContext>;
  private maxHistoryLength: number = 20; // Keep last 20 messages

  constructor(ollamaClient: OllamaClient, modelRouter: ModelRouter) {
    this.ollamaClient = ollamaClient;
    this.modelRouter = modelRouter;
    this.conversations = new Map();
    logger.info('Conversation manager initialized');
  }

  /**
   * Initialize new conversation
   */
  initConversation(conversationId: string, systemPrompt?: string): void {
    const context: ConversationContext = {
      conversationId,
      messages: systemPrompt ? [{
        role: 'system',
        content: systemPrompt,
        timestamp: new Date()
      }] : [],
      metadata: {
        createdAt: new Date(),
        lastUpdated: new Date(),
        totalMessages: 0
      }
    };

    this.conversations.set(conversationId, context);
    logger.info(`Conversation ${conversationId} initialized`);
  }

  /**
   * Add context about current idea/plan
   */
  setContext(
    conversationId: string,
    context: {
      idea?: any;
      businessPlan?: any;
      userPreferences?: any;
    }
  ): void {
    const conversation = this.conversations.get(conversationId);
    if (conversation) {
      conversation.currentIdea = context.idea;
      conversation.currentBusinessPlan = context.businessPlan;
      conversation.userPreferences = context.userPreferences;
      logger.debug(`Context set for conversation ${conversationId}`);
    }
  }

  /**
   * Send message and get response
   */
  async sendMessage(
    conversationId: string,
    userMessage: string,
    options?: {
      streaming?: boolean;
      onChunk?: (chunk: string) => void;
      taskType?: TaskType;
    }
  ): Promise<string> {
    let conversation = this.conversations.get(conversationId);

    if (!conversation) {
      this.initConversation(conversationId, GENERAL_ASSISTANT_SYSTEM);
      conversation = this.conversations.get(conversationId)!;
    }

    // Add user message to history
    conversation.messages.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });

    // Build context-aware prompt
    const contextPrompt = this.buildContextPrompt(conversation, userMessage);

    // Determine task type
    const taskType = options?.taskType || this.detectTaskType(userMessage);

    try {
      logger.info(`Processing message in conversation ${conversationId}`);
      let assistantResponse: string;

      if (options?.streaming && options.onChunk) {
        assistantResponse = await this.modelRouter.executeTask(
          taskType,
          contextPrompt,
          undefined,
          {
            streaming: true,
            onChunk: options.onChunk,
            temperature: 0.7
          }
        );
      } else {
        assistantResponse = await this.modelRouter.executeTask(
          taskType,
          contextPrompt,
          undefined,
          { temperature: 0.7 }
        );
      }

      // Add assistant response to history
      conversation.messages.push({
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      });

      // Trim history if too long
      this.trimHistory(conversation);

      // Update metadata
      conversation.metadata.lastUpdated = new Date();
      conversation.metadata.totalMessages += 2;

      return assistantResponse;

    } catch (error: any) {
      logger.error('Error in conversation:', error);
      throw error;
    }
  }

  /**
   * Build context-aware prompt
   */
  private buildContextPrompt(
    conversation: ConversationContext,
    currentMessage: string
  ): string {
    let prompt = '';

    // Add conversation history (last N messages)
    const recentMessages = conversation.messages.slice(-10);
    if (recentMessages.length > 0) {
      prompt += 'CONVERSATION HISTORY:\n';
      recentMessages.forEach(msg => {
        if (msg.role !== 'system') {
          prompt += `${msg.role.toUpperCase()}: ${msg.content}\n`;
        }
      });
      prompt += '\n';
    }

    // Add current business context if available
    if (conversation.currentIdea) {
      prompt += 'CURRENT BUSINESS IDEA:\n';
      prompt += `Title: ${conversation.currentIdea.title}\n`;
      prompt += `Description: ${conversation.currentIdea.oneLiner || conversation.currentIdea.description}\n`;
      prompt += `Industry: ${conversation.currentIdea.industry}\n\n`;
    }

    if (conversation.currentBusinessPlan) {
      prompt += 'BUSINESS PLAN STATUS: Available\n';
      const sections = Object.keys(conversation.currentBusinessPlan);
      if (sections.length > 0) {
        prompt += `Sections Completed: ${sections.join(', ')}\n\n`;
      }
    }

    // Add current user message
    prompt += `USER QUESTION: ${currentMessage}\n\n`;
    prompt += 'Provide a helpful, concise response. If the user is asking about their business idea or plan, reference the context provided above.';

    return prompt;
  }

  /**
   * Detect task type from message
   */
  private detectTaskType(message: string): TaskType {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('idea') || lowerMessage.includes('business concept')) {
      return TaskType.IDEA_GENERATION;
    }
    if (lowerMessage.includes('market') || lowerMessage.includes('competitor')) {
      return TaskType.MARKET_ANALYSIS;
    }
    if (lowerMessage.includes('financial') || lowerMessage.includes('revenue') || lowerMessage.includes('profit')) {
      return TaskType.FINANCIAL_PROJECTIONS;
    }
    if (lowerMessage.includes('marketing') || lowerMessage.includes('customer acquisition')) {
      return TaskType.MARKETING_STRATEGY;
    }
    if (lowerMessage.includes('operations') || lowerMessage.includes('workflow')) {
      return TaskType.OPERATIONS_PLANNING;
    }
    if (lowerMessage.includes('legal') || lowerMessage.includes('compliance') || lowerMessage.includes('license')) {
      return TaskType.LEGAL_COMPLIANCE;
    }
    if (lowerMessage.includes('code') || lowerMessage.includes('script') || lowerMessage.includes('implement')) {
      return TaskType.CODE_GENERATION;
    }
    if (lowerMessage.includes('risk') || lowerMessage.includes('challenge')) {
      return TaskType.RISK_ANALYSIS;
    }

    return TaskType.QUICK_CHAT;
  }

  /**
   * Trim conversation history
   */
  private trimHistory(conversation: ConversationContext): void {
    if (conversation.messages.length > this.maxHistoryLength) {
      const systemMessages = conversation.messages.filter(m => m.role === 'system');
      const recentMessages = conversation.messages
        .filter(m => m.role !== 'system')
        .slice(-this.maxHistoryLength);

      conversation.messages = [...systemMessages, ...recentMessages];
      logger.debug(`Trimmed conversation history to ${this.maxHistoryLength} messages`);
    }
  }

  /**
   * Get conversation history
   */
  getHistory(conversationId: string): Message[] {
    const conversation = this.conversations.get(conversationId);
    return conversation ? conversation.messages : [];
  }

  /**
   * Clear conversation
   */
  clearConversation(conversationId: string): void {
    this.conversations.delete(conversationId);
    logger.info(`Conversation ${conversationId} cleared`);
  }

  /**
   * Get all active conversations
   */
  getActiveConversations(): string[] {
    return Array.from(this.conversations.keys());
  }
}

export { ConversationManager };
export default ConversationManager;
