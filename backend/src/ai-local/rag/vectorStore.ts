import OllamaClient from '../services/ollamaClient';
import logger from '../../middleware/logger';
import { Document } from '../types/ollamaTypes';

/**
 * In-memory Vector Store for RAG (Retrieval Augmented Generation)
 * Stores document embeddings and performs similarity search
 */
class VectorStore {
    private documents: Map<string, Document>;
    private ollamaClient: OllamaClient;
    private embeddingModel: string = 'llama3.1:8b';

    constructor(ollamaClient: OllamaClient) {
        this.ollamaClient = ollamaClient;
        this.documents = new Map();
        logger.info('Vector store initialized');
    }

    /**
     * Add document to vector store
     */
    async addDocument(
        id: string,
        content: string,
        metadata: Document['metadata']
    ): Promise<void> {
        try {
            // Generate embedding
            const embedding = await this.ollamaClient.embeddings(
                content,
                this.embeddingModel
            );

            const document: Document = {
                id,
                content,
                embedding,
                metadata: {
                    ...metadata,
                    createdAt: new Date()
                }
            };

            this.documents.set(id, document);
            logger.debug(`Added document ${id} to vector store`);
        } catch (error: any) {
            logger.error(`Error adding document ${id}:`, error);
            throw error;
        }
    }

    /**
     * Add multiple documents in batch
     */
    async addDocuments(
        documents: Array<{
            id: string;
            content: string;
            metadata: Document['metadata'];
        }>
    ): Promise<void> {
        logger.info(`Adding ${documents.length} documents to vector store`);

        for (const doc of documents) {
            await this.addDocument(doc.id, doc.content, doc.metadata);
        }

        logger.info(`Successfully added ${documents.length} documents`);
    }

    /**
     * Find similar documents using cosine similarity
     */
    async findSimilar(
        query: string,
        topK: number = 5,
        filter?: Partial<Document['metadata']>
    ): Promise<Document[]> {
        try {
            // Generate query embedding
            const queryEmbedding = await this.ollamaClient.embeddings(
                query,
                this.embeddingModel
            );

            // Filter documents
            let candidates = Array.from(this.documents.values());

            if (filter) {
                candidates = candidates.filter(doc => {
                    return Object.entries(filter).every(([key, value]) => {
                        if (value === undefined) return true;
                        return doc.metadata[key as keyof Document['metadata']] === value;
                    });
                });
            }

            if (candidates.length === 0) {
                logger.debug('No documents match filter criteria');
                return [];
            }

            // Calculate cosine similarity
            const similarities = candidates.map(doc => ({
                document: doc,
                similarity: this.cosineSimilarity(queryEmbedding, doc.embedding)
            }));

            // Sort by similarity and return top K
            similarities.sort((a, b) => b.similarity - a.similarity);
            const results = similarities.slice(0, topK).map(item => item.document);

            logger.debug(`Found ${results.length} similar documents`);
            return results;

        } catch (error: any) {
            logger.error('Error finding similar documents:', error);
            return [];
        }
    }

    /**
     * Cosine similarity calculation
     */
    private cosineSimilarity(vec1: number[], vec2: number[]): number {
        if (vec1.length !== vec2.length) {
            throw new Error('Vectors must have same length');
        }

        let dotProduct = 0;
        let norm1 = 0;
        let norm2 = 0;

        for (let i = 0; i < vec1.length; i++) {
            dotProduct += vec1[i] * vec2[i];
            norm1 += vec1[i] * vec1[i];
            norm2 += vec2[i] * vec2[i];
        }

        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }

    /**
     * Get document by ID
     */
    getDocument(id: string): Document | undefined {
        return this.documents.get(id);
    }

    /**
     * Delete document
     */
    deleteDocument(id: string): boolean {
        const deleted = this.documents.delete(id);
        if (deleted) {
            logger.debug(`Deleted document ${id}`);
        }
        return deleted;
    }

    /**
     * Get all documents
     */
    getAllDocuments(): Document[] {
        return Array.from(this.documents.values());
    }

    /**
     * Clear all documents
     */
    clear(): void {
        this.documents.clear();
        logger.info('Vector store cleared');
    }

    /**
     * Get statistics
     */
    getStats(): {
        totalDocuments: number;
        documentsByType: Record<string, number>;
        documentsByIndustry: Record<string, number>;
    } {
        const docs = Array.from(this.documents.values());

        const byType: Record<string, number> = {};
        const byIndustry: Record<string, number> = {};

        docs.forEach(doc => {
            byType[doc.metadata.type] = (byType[doc.metadata.type] || 0) + 1;
            if (doc.metadata.industry) {
                byIndustry[doc.metadata.industry] = (byIndustry[doc.metadata.industry] || 0) + 1;
            }
        });

        return {
            totalDocuments: docs.length,
            documentsByType: byType,
            documentsByIndustry: byIndustry
        };
    }
}

export { VectorStore };
export default VectorStore;
