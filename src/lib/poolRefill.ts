import { getSupabase } from './supabaseClient';
import { getGeminiConfig } from './geminiService';
import { GoogleGenAI } from '@google/genai';
import { checkDuplicate, hashText } from './deduplication';

export interface PoolConfig {
  targetPoolSize: number;
  minimumPoolThreshold: number;
  maxBackgroundConcurrency: number;
}

export const DEFAULT_POOL_CONFIG: PoolConfig = {
  targetPoolSize: 30,
  minimumPoolThreshold: 10,
  maxBackgroundConcurrency: 2,
};

let isRefillJobRunning = false;

export interface PoolHealthStatus {
  availableCount: number;
  isRefillNeeded: boolean;
  isJobRunning: boolean;
  targetPoolSize: number;
  minimumPoolThreshold: number;
}

/**
 * Checks the current template pool health and triggers refill if below threshold.
 */
export async function checkAndRefillPool(
  config: PoolConfig = DEFAULT_POOL_CONFIG
): Promise<PoolHealthStatus> {
  const supabase = getSupabase();
  const { isConfigured } = getGeminiConfig();

  let availableCount = 30; // fallback default

  if (supabase) {
    try {
      const { count, error } = await supabase
        .from('review_templates')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'available');

      if (!error && typeof count === 'number') {
        availableCount = count;
      }
    } catch (e) {
      console.warn('Failed to query review_templates count:', e);
    }
  }

  const isRefillNeeded = availableCount < config.minimumPoolThreshold;

  // Trigger background refill if needed and not already executing
  if (isRefillNeeded && !isRefillJobRunning && isConfigured && supabase) {
    runBackgroundRefill(config, availableCount).catch((err) => {
      console.error('Background refill job error:', err);
    });
  }

  return {
    availableCount,
    isRefillNeeded,
    isJobRunning: isRefillJobRunning,
    targetPoolSize: config.targetPoolSize,
    minimumPoolThreshold: config.minimumPoolThreshold,
  };
}

async function runBackgroundRefill(config: PoolConfig, currentAvailable: number) {
  if (isRefillJobRunning) return;
  isRefillJobRunning = true;

  const supabase = getSupabase();
  const { apiKey, model } = getGeminiConfig();
  if (!supabase || !apiKey) {
    isRefillJobRunning = false;
    return;
  }

  const needed = Math.min(
    config.targetPoolSize - currentAvailable,
    config.maxBackgroundConcurrency * 5
  );

  if (needed <= 0) {
    isRefillJobRunning = false;
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Retrieve existing texts for deduplication
    const { data: existingRows } = await supabase
      .from('review_templates')
      .select('template_text');

    const existingTexts = existingRows ? existingRows.map((r) => r.template_text) : [];

    const languages: ('en' | 'gu' | 'hi')[] = ['en', 'gu', 'hi'];

    for (let i = 0; i < needed; i++) {
      const lang = languages[i % languages.length];
      const prompt = `Generate ONE short, natural review template for Apple Beauty Salon in Kudasan, Gandhinagar.
Language: ${lang === 'gu' ? 'Gujarati' : lang === 'hi' ? 'Hindi' : 'English'}.
Focus on a natural salon experience (e.g. hair styling, skincare, gentle waxing, hygiene, relaxing environment).
Do not use clichés like "The best salon" or "I love this salon".
Output ONLY the review text.`;

      try {
        const res = await ai.models.generateContent({ model, contents: prompt });
        const text = res.text?.trim();

        if (text && text.length > 25) {
          const dupResult = checkDuplicate(text, existingTexts, 0.70);
          if (!dupResult.isDuplicate) {
            const hash = hashText(text);

            // Fetch business ID
            const { data: biz } = await supabase
              .from('businesses')
              .select('id')
              .eq('slug', 'apple-beauty-salon')
              .single();

            if (biz) {
              await supabase.from('review_templates').insert({
                business_id: biz.id,
                language: lang,
                template_text: text,
                content_hash: hash,
                status: 'available',
              });
              existingTexts.push(text);
            }
          }
        }
      } catch (err) {
        console.warn('Gemini refill call failed (rate-limit/network):', err);
        break; // stop on rate-limit to avoid burning quota
      }
    }
  } finally {
    isRefillJobRunning = false;
  }
}
