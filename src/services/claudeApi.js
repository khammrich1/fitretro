import Anthropic from '@anthropic-ai/sdk';

class ClaudeApiService {
  constructor() {
    // API key should be set via environment variable or config
    this.apiKey = null;
    this.client = null;
  }

  // Initialize with API key
  initialize(apiKey) {
    this.apiKey = apiKey;
    this.client = new Anthropic({
      apiKey: this.apiKey,
    });
  }

  // Check if initialized
  isInitialized() {
    return this.client !== null && this.apiKey !== null;
  }

  // Parse meal description and extract nutrition data
  async parseMeal(mealDescription) {
    if (!this.isInitialized()) {
      return {
        success: false,
        error: 'Claude API not initialized. Please add your API key in settings.',
      };
    }

    try {
      const prompt = `You are a nutrition expert assistant. A user has logged the following meal:

"${mealDescription}"

Please analyze this meal and provide a detailed nutritional breakdown in JSON format. Be as accurate as possible with your estimates.

Return ONLY a valid JSON object with this exact structure (no additional text):
{
  "name": "descriptive meal name",
  "calories": number,
  "protein": number (in grams),
  "carbs": number (in grams),
  "fats": number (in grams),
  "confidence": "high" | "medium" | "low",
  "suggestions": "brief helpful suggestions for this meal (optional)"
}

If the input is unclear or not food-related, set confidence to "low" and make your best estimate.`;

      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      // Extract JSON from response
      const responseText = message.content[0].text.trim();

      // Try to parse JSON, handling potential markdown code blocks
      let jsonText = responseText;
      if (responseText.includes('```json')) {
        jsonText = responseText.split('```json')[1].split('```')[0].trim();
      } else if (responseText.includes('```')) {
        jsonText = responseText.split('```')[1].split('```')[0].trim();
      }

      const nutritionData = JSON.parse(jsonText);

      return {
        success: true,
        data: {
          name: nutritionData.name || mealDescription,
          calories: nutritionData.calories || 0,
          protein: nutritionData.protein || 0,
          carbs: nutritionData.carbs || 0,
          fats: nutritionData.fats || 0,
          confidence: nutritionData.confidence || 'low',
          suggestions: nutritionData.suggestions || null,
        },
      };
    } catch (error) {
      console.error('Claude API Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to parse meal',
      };
    }
  }

  // Get meal suggestions based on nutrition goals
  async getMealSuggestions(goals, preferences = {}) {
    if (!this.isInitialized()) {
      return {
        success: false,
        error: 'Claude API not initialized',
      };
    }

    try {
      const prompt = `You are a nutrition expert. Suggest 3-5 healthy meals based on these daily nutrition goals:

Calories: ${goals.calories}
Protein: ${goals.protein}g
Carbs: ${goals.carbs}g
Fats: ${goals.fats}g

${preferences.dietary ? `Dietary preferences: ${preferences.dietary}` : ''}
${preferences.allergies ? `Allergies: ${preferences.allergies}` : ''}

Provide meal suggestions in JSON format with this structure:
{
  "meals": [
    {
      "name": "meal name",
      "description": "brief description",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fats": number
    }
  ]
}`;

      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const responseText = message.content[0].text.trim();
      let jsonText = responseText;
      if (responseText.includes('```json')) {
        jsonText = responseText.split('```json')[1].split('```')[0].trim();
      } else if (responseText.includes('```')) {
        jsonText = responseText.split('```')[1].split('```')[0].trim();
      }

      const suggestions = JSON.parse(jsonText);

      return {
        success: true,
        data: suggestions.meals || [],
      };
    } catch (error) {
      console.error('Claude API Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get meal suggestions',
      };
    }
  }

  // Chat with Claude about nutrition/fitness
  async chat(message, conversationHistory = []) {
    if (!this.isInitialized()) {
      return {
        success: false,
        error: 'Claude API not initialized',
      };
    }

    try {
      const systemPrompt = `You are FitRetro AI, a helpful fitness and nutrition assistant with an enthusiastic, motivating personality. You help users with:
- Meal logging and nutrition tracking
- Workout advice and exercise tips
- Fitness goal setting and motivation
- General health and wellness questions

Keep responses concise, friendly, and actionable. Use occasional 80s slang and references when appropriate to match the retrowave aesthetic of the app.`;

      const messages = [
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        {
          role: 'user',
          content: message,
        },
      ];

      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages,
      });

      return {
        success: true,
        data: {
          message: response.content[0].text,
          role: 'assistant',
        },
      };
    } catch (error) {
      console.error('Claude API Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to chat',
      };
    }
  }
}

export default new ClaudeApiService();
