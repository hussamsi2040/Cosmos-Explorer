# Luna AI Assistant Setup

## OpenRouter API Integration

Luna AI Assistant is powered by OpenRouter's API using the `openai/o4-mini` model for intelligent space education responses.

### Setup Instructions

1. **Get OpenRouter API Key**
   - Visit [OpenRouter.ai](https://openrouter.ai/keys)
   - Sign up for an account if you don't have one
   - Generate a new API key (starts with `sk-or-v1-`)

2. **Configure Environment Variables**
   - Open `.env.local` in the project root
   - Replace `your_openrouter_api_key_here` with your actual API key:
   ```
   NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
   ```

3. **Restart Development Server**
   ```bash
   npm run dev
   ```

### Features

- **Real AI Responses**: Luna uses OpenRouter's o4-mini model for intelligent conversations
- **Space Education Focus**: System prompt optimized for space and astronomy topics
- **Fallback System**: If API fails, Luna falls back to pre-built educational responses
- **Rate Limiting**: Built-in error handling and graceful degradation

### Cost Management

- **Model**: `openai/o4-mini` - Cost-effective option
- **Token Limit**: 200 tokens per response to control costs
- **Temperature**: 0.7 for balanced creativity and accuracy

### Security

- API keys are stored in `.env.local` (git-ignored)
- Client-side usage with `NEXT_PUBLIC_` prefix for browser access
- Proper error handling prevents API key exposure

### Testing

1. Navigate to `/luna-ai`
2. Ask Luna about space topics like:
   - "Tell me about black holes"
   - "How do rockets work?"
   - "What is the International Space Station?"
   - "Explain the solar system"

Luna will provide educational, engaging responses with emojis and interesting facts!

### Troubleshooting

- **No API responses**: Check if API key is correctly set in `.env.local`
- **Fallback responses**: Luna automatically uses pre-built responses if API fails
- **Development mode**: Restart server after changing environment variables