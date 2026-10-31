import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import { CURATED_TEMPLATES } from '../lib/curatedPool';
import { checkDuplicate, getOpeningSentence } from '../lib/deduplication';

let isReplenishing = false;
const sessionUsedOpenings = new Set<string>();

const CORE_PROMPT = `You are a professional English-language writing assistant for Apple Beauty Salon in Kudasan, Gandhinagar, Gujarat, India.

Create one concise, natural, editable review-writing suggestion based only on the customer's actual feedback and the information they confirm.

Every suggestion must use a fresh opening, varied sentence structure, and natural English. Avoid repetitive phrases, keyword stuffing, exaggerated claims, invented experiences, and unsupported statements about treatments or results.

Mention Apple Beauty Salon or its location only when relevant. Include a service name or local keyword only when it accurately reflects the customer's experience.

Return only the review draft, without quotation marks, explanations, headings, or additional commentary.`;

export async function handleGenerateReviewRequest(
  body: { currentText?: string; forceNew?: boolean },
  env: Record<string, string | undefined>
) {
  const currentText = (body.currentText || '').trim();
  const supabaseUrl = (env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://zlzcqsputncpqpgodylv.supabase.co').trim();
  const supabaseAnonKey = (env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_TTAh9qd4T1hf3ZXIUHqvfQ_d6mFSPe7').trim();
  const googleReviewUrl = 'https://g.page/r/CfqPqR1K8nwbEBM/review';

  // 1. FAST RETRIEVAL: Query Supabase review_templates for unused drafts (is_used = false)
  if (supabaseUrl && supabaseAnonKey) {
    try {
      const client = createClient(supabaseUrl, supabaseAnonKey);
      const { data, error } = await client
        .from('review_templates')
        .select('id, business_name, review_text, is_used')
        .eq('is_used', false)
        .limit(20);

      if (!error && data && data.length > 0) {
        // Filter out currently displayed text and prefer fresh opening lines
        const filtered = data.filter((row) => {
          const text = row.review_text.trim();
          if (text === currentText) return false;
          return true;
        });

        // Find candidate with opening not yet seen in session
        let chosen = filtered.find((r) => {
          const op = getOpeningSentence(r.review_text);
          return !sessionUsedOpenings.has(op);
        });

        if (!chosen && filtered.length > 0) {
          chosen = filtered[0];
        }

        if (chosen) {
          const opening = getOpeningSentence(chosen.review_text);
          sessionUsedOpenings.add(opening);
          if (sessionUsedOpenings.size > 20) sessionUsedOpenings.clear();

          // Check if pool replenishment is needed in the background (< 10 unused remaining)
          const remainingUnused = data.length;
          if (remainingUnused < 10 && !isReplenishing) {
            triggerBackgroundReplenishment(client, env).catch(() => {});
          }

          return {
            success: true,
            id: chosen.id,
            reviewText: chosen.review_text,
            source: 'supabase_review_templates',
            googleReviewUrl,
          };
        }
      }
    } catch (e: unknown) {
      console.warn('[Supabase Fast Retrieval Notice]:', e instanceof Error ? e.message : 'Fallback');
    }
  }

  // 2. High-Performance Curated Fallback Pool (Guarantees instant < 50ms response)
  const eligible = CURATED_TEMPLATES.filter((t) => t.templateText.trim() !== currentText);
  const pool = eligible.length > 0 ? eligible : CURATED_TEMPLATES;
  const selected = pool[Math.floor(Math.random() * pool.length)];

  return {
    success: true,
    id: selected.id,
    reviewText: selected.templateText,
    source: 'prepared_template_pool',
    googleReviewUrl,
  };
}

/**
 * Background replenishment using Gemini 3.1 Flash Lite
 * Runs asynchronously without blocking the user request.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function triggerBackgroundReplenishment(client: any, env: Record<string, string | undefined>) {
  if (isReplenishing) return;
  isReplenishing = true;

  const apiKey = (env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim();
  const model = (env.GEMINI_MODEL || process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite').trim();

  if (!apiKey || apiKey.includes('YOUR_GEMINI')) {
    isReplenishing = false;
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Fetch existing reviews to avoid duplicates
    const { data: existingRows } = await client
      .from('review_templates')
      .select('review_text')
      .limit(50);

    const existingTexts: string[] = existingRows
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? existingRows.map((r: any) => String(r.review_text || ''))
      : [];

    // Generate up to 3 drafts at a time with polite spacing
    for (let i = 0; i < 3; i++) {
      const response = await ai.models.generateContent({
        model,
        contents: CORE_PROMPT,
      });

      const text = response.text?.trim();
      if (text && text.length > 25) {
        const dupResult = checkDuplicate(text, existingTexts, 0.70);
        if (!dupResult.isDuplicate) {
          await client.from('review_templates').insert([
            {
              business_name: 'Apple Beauty Salon',
              review_text: text,
              is_used: false,
            },
          ]);
          existingTexts.push(text);
        }
      }
    }
  } catch (err: unknown) {
    console.warn('[Background Replenish Info]: Gemini temporary notice:', err instanceof Error ? err.message.slice(0, 80) : 'rate limit');
  } finally {
    isReplenishing = false;
  }
}
