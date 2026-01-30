# Ollama Local AI Integration

Complete guide for setting up and using the local AI integration with Ollama.

## **Quick Start**

### Prerequisites
- **Ollama** installed and running
- **Node.js** 18+ and npm
- **16GB+ RAM** recommended (32GB for 70b models)
- ~50GB disk space for models

### 1. Install Ollama

**Windows:**
```powershell
winget install Ollama.Ollama
```

**Mac:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSH https://ollama.com/install.sh | sh
```

### 2 Pull Required Models

```bash
# Primary model (best quality, slower)
ollama pull llama3.1:70b

# Fast model (quick responses)
ollama pull llama3.1:8b

# Financial/analytical tasks
ollama pull mistral:7b

# Optional: Code generation
ollama pull codellama:13b

# Optional: Balanced speed/quality
ollama pull mixtral:8x7b
```

### 3. Start Ollama Service

```bash
ollama serve
```

Ollama will run on `http://localhost:11434`

### 4. Configure Environment

Update `.env`:
```env
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_DEFAULT_MODEL=llama3.1:70b
```

### 5. Start Backend

```bash
cd backend
npm install
npm run dev
```

---

## **API Endpoints**

### Generate Business Ideas
```http
POST /api/ai/ollama/generate-ideas
Content-Type: text/event-stream

{
  "industry": "Technology",
  "budgetMin": 10000,
  "budgetMax": 50000,
  "location": "San Francisco",
  "timeline": "6 months",
  "skills": ["programming", "marketing"],
  "riskTolerance": "medium",
  "businessModel": ["SaaS", "B2B"],
  "targetMarket": "Small businesses"
}
```

**Response**: Server-Sent Events (SSE) stream
```javascript
// Progress updates
data: {"type":"progress","message":"Analyzing your inputs..."}

// Final result
data: {"type":"complete","data":{"ideas":[...]}}
```

### Generate Business Plan
```http
POST /api/ai/ollama/business-plan
Content-Type: text/event-stream

{
  "idea": {
    "title": "AI-Powered Marketing Tool",
    "description": "...",
    "industry": "Technology"
  },
  "userInputs": {
    "location": "San Francisco"
  }
}
```

### Chat with AI Assistant
```http
POST /api/ai/ollama/chat

{
  "conversationId": "unique-id-123",
  "message": "How can I improve my marketing strategy?",
  "context": {
    "idea": {...},
    "businessPlan": {...}
  },
  "streaming": true
}
```

### Health Check
```http
GET /api/ai/ollama/health

Response:
{
  "success": true,
  "healthy": true,
  "status": "running"
}
```

### Service Statistics
```http
GET /api/ai/ollama/stats

Response:
{
  "success": true,
  "stats": {
    "ollama": {
      "healthy": true,
      "baseUrl": "http://localhost:11434"
    },
    "modelPerformance": {...},
    "cache": {
      "size": 10,
      "totalHits": 25
    }
  }
}
```

---

## **Model Selection Logic**

The system automatically selects the best model for each task:

| Task | Primary Model | Speed Tier | Quality Tier |
|------|--------------|------------|--------------|
| Idea Generation | llama3.1:70b | Slow | High |
| Market Analysis | llama3.1:70b | Slow | High |
| Financial Projections | mistral:7b | Fast | Medium |
| Marketing Strategy | llama3.1:70b | Slow | High |
| Operations Planning | llama3.1:8b | Fast | Medium |
| Legal Compliance | mistral:7b | Fast | Medium |
| Risk Analysis | mistral:7b | Fast | Medium |
| Quick Chat | llama3.1:8b | Fast | Medium |
| Code Generation | codellama:13b | Medium | High |

---

## **Performance Tips**

### 1. Response Caching
Identical requests are cached for 1 hour. The second request will be instant.

### 2. Model Selection
- Use `prioritize: 'speed'` for quick responses
- Use `prioritize: 'quality'` for complex generation (default)

### 3. Streaming
Always use streaming for better UX:
```typescript
const eventSource = new EventSource('/api/ai/ollama/generate-ideas');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'progress') {
    console.log(data.message);
  } else if (data.type === 'complete') {
    console.log('Result:', data.data);
    eventSource.close();
  }
};
```

### 4. GPU Acceleration
If you have an NVIDIA GPU:
```bash
# Ollama automatically uses GPU if available
# Verify GPU usage:
nvidia-smi
```

---

## **Troubleshooting**

### Ollama Not Running
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve
```

### Model Not Found
```bash
# List installed models
ollama list

# Pull missing model
ollama pull llama3.1:70b
```

### Out of Memory
- Close other applications
- Use smaller models (8b instead of 70b)
- Reduce `num_ctx` in requests

### Slow Generation
- Use GPU if available
- Switch to smaller models for non-critical tasks
- Enable response caching
- Use `prioritize: 'speed'` option

### Invalid JSON Response
The system automatically cleans JSON responses. If issues persist:
- Lower the temperature (0.5-0.6)
- Use more specific prompts
- Check model compatibility

---

## **Advanced Configuration**

### Custom Model Configuration
Edit `ai-local/services/modelRouter.ts`:

```typescript
this.modelCapabilities.push({
  model: 'your-custom-model',
  tasks: [TaskType.IDEA_GENERATION],
  contextWindow: 8192,
  speedTier: 'fast',
  qualityTier: 'high',
  description: 'Custom model description'
});
```

### Adjust Context Window
```typescript
// In aiService.ts
options: {
  num_ctx: 16384 // Increase for longer contexts
}
```

### Custom System Prompts
Edit `ai-local/prompts/systemPrompts.ts` to customize AI behavior.

---

## **Monitoring**

### Check Model Performance
```http
GET /api/ai/ollama/stats
```

Returns:
- Average generation time per model
- Success rate
- Total requests
- Cache hit rate

### Logs
```bash
# Backend logs show:
# - Model selection decisions
# - Generation times
# - Cache hits/misses
# - Errors and warnings

tail -f backend/logs/combined.log
```

---

## **Cost Savings**

Running locally = **$0/month** vs cloud APIs:
- Anthropic Claude: ~$15-50/month
- OpenAI GPT-4: ~$20-100/month
- Google Gemini: ~$10-40/month

**Break-even**: Hardware investment pays off after 2-6 months of usage.

---

## **Security & Privacy**

✅ All data stays on your machine  
✅ No external API calls  
✅ No data logging or tracking  
✅ Full offline capability  
✅  GDPR/HIPAA friendly  

---

## **Next Steps**

1. ✅ Install Ollama
2. ✅ Pull models
3. ✅ Start backend
4. ✅ Test health endpoint
5. ✅ Generate first business idea
6. 📱 Integrate frontend
7. 🚀 Deploy to production
