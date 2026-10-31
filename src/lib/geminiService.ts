import { GoogleGenAI } from '@google/genai';
import { retrieveReviewDraft } from './supabaseClient';
import { checkDuplicate } from './deduplication';

interface GenerateReviewParams {
  serviceCategory?: string;
  customerFeedback?: string;
  aspects?: string[];
}

export interface ReviewGenerationResponse {
  reviewText: string;
  source: 'gemini_3.1_flash_lite' | 'prepared_template_pool';
  language: 'en';
}

export function getGeminiConfig() {
  const apiKey = (
    (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
    (typeof import.meta !== 'undefined' && (import.meta.env as any)?.VITE_GEMINI_API_KEY) ||
    ''
  ).trim();

  const model = (
    (typeof process !== 'undefined' && process.env?.GEMINI_MODEL) ||
    (typeof import.meta !== 'undefined' && (import.meta.env as any)?.VITE_GEMINI_MODEL) ||
    'gemini-3.1-flash-lite'
  ).trim();

  const isConfigured = Boolean(apiKey && !apiKey.includes('YOUR_GEMINI_API_KEY'));

  return { apiKey, model, isConfigured };
}

/**
 * Generates or personalizes an English review for Apple Beauty Salon.
 * When genuine feedback is provided and Gemini API key is configured, uses Gemini 3.1 Flash Lite.
 * Otherwise, retrieves a prepared template from the pool instantly with ZERO API wait.
 */
export async function generateOrRetrieveReview(
  params: GenerateReviewParams = {}
): Promise<ReviewGenerationResponse> {
  const { serviceCategory = 'Salon Services', customerFeedback, aspects = [] } = params;
  const { apiKey, model, isConfigured } = getGeminiConfig();

  // If no customer feedback is provided OR Gemini is not configured,
  // retrieve a prepared template immediately (fast initial rendering, 0 API calls).
  if (!customerFeedback?.trim() || !isConfigured) {
    const fallback = await retrieveReviewDraft();
    return {
      reviewText: fallback.reviewText,
      source: 'prepared_template_pool',
      language: 'en',
    };
  }

  // Personalize with Gemini based on customer's actual input
  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert review suggestion assistant for Apple Beauty Salon in Kudasan, Gandhinagar.
The customer visited the salon and gave the following genuine notes:
- Service Experienced: ${serviceCategory}
- Customer Notes: "${customerFeedback}"
${aspects.length > 0 ? `- Appreciated Highlights: ${aspects.join(', ')}` : ''}

TASK:
Craft ONE concise, authentic, customer-first review draft (30 to 50 words) based strictly on their actual experience.
Write ONLY in fluent, natural English. Never output any other language.

CRITICAL RULES:
1. Do NOT fabricate treatments, results, or medical claims.
2. Do NOT use clichéd starters like "I love this salon" or "The best salon in town".
3. Reflect the customer's actual sentiment (positive, neutral, or constructive).
4. Output ONLY the review text. No quotation marks, no preamble, no markdown.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const generatedText = response.text?.trim();

    if (generatedText && generatedText.length > 20) {
      const dupCheck = checkDuplicate(generatedText, [], 0.70);

      if (!dupCheck.isDuplicate) {
        return {
          reviewText: generatedText,
          source: 'gemini_3.1_flash_lite',
          language: 'en',
        };
      }
    }
  } catch (error: unknown) {
    console.warn('Gemini API call notice:', error instanceof Error ? error.message : 'Fallback');
  }

  // Graceful fallback to prepared pool
  const fallback = await retrieveReviewDraft();
  return {
    reviewText: fallback.reviewText,
    source: 'prepared_template_pool',
    language: 'en',
  };
}
