import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CURATED_TEMPLATES } from './curatedPool';

let localPoolIndex = 0;
const usedDraftIds = new Set<string>();

export function getSupabaseConfig() {
  const url = (
    (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
    'https://zlzcqsputncpqpgodylv.supabase.co'
  ).trim();

  const anonKey = (
    (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_ANON_KEY || process.env?.VITE_SUPABASE_PUBLISHABLE_KEY)) ||
    (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY)) ||
    'sb_publishable_TTAh9qd4T1hf3ZXIUHqvfQ_d6mFSPe7'
  ).trim();

  const isConfigured = Boolean(url && anonKey && !url.includes('your-supabase'));

  return { url, anonKey, isConfigured };
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured) return null;

  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey);
    } catch (e: unknown) {
      console.warn('Notice: Supabase client initialization error:', e instanceof Error ? e.message : 'Unknown');
      return null;
    }
  }
  return supabaseInstance;
}

export interface ReviewDraftResult {
  id?: string;
  reviewText: string;
  source: 'supabase_review_templates' | 'curated_in_memory_pool';
  errorDetails?: string;
}

/**
 * Retrieves an available English review draft from Supabase review_templates.
 * If Supabase is unavailable or permissions are pending, falls back seamlessly to curated English pool.
 */
export async function retrieveReviewDraft(currentText = ''): Promise<ReviewDraftResult> {
  const supabase = getSupabase();

  if (supabase) {
    try {
      // 1. Try querying review_templates where is_used is false
      const { data, error } = await supabase
        .from('review_templates')
        .select('id, business_name, review_text, is_used')
        .eq('is_used', false)
        .limit(20);

      if (!error && data && data.length > 0) {
        // Find one that doesn't match currentText and hasn't been presented in this session
        const available = data.filter(
          (row) => row.review_text.trim() !== currentText.trim() && !usedDraftIds.has(row.id)
        );

        const chosen = available.length > 0 ? available[0] : data[0];
        usedDraftIds.add(chosen.id);

        return {
          id: chosen.id,
          reviewText: chosen.review_text,
          source: 'supabase_review_templates',
        };
      } else if (error) {
        // Safe logging without exposing secrets
        console.warn('[Supabase Database Info]', error.message, error.hint || '');
      }
    } catch (err: unknown) {
      console.warn('[Supabase Query Notice]', err instanceof Error ? err.message : 'Connection failed');
    }
  }

  // Fallback to our authentic 30-template curated English pool
  const eligible = CURATED_TEMPLATES.filter((t) => t.templateText.trim() !== currentText.trim());
  const pool = eligible.length > 0 ? eligible : CURATED_TEMPLATES;
  localPoolIndex = (localPoolIndex + 1) % pool.length;
  const item = pool[localPoolIndex];

  return {
    id: item.id,
    reviewText: item.templateText,
    source: 'curated_in_memory_pool',
  };
}

/**
 * Marks a review draft as used in Supabase when confirmed by the customer.
 */
export async function markReviewAsUsed(id?: string, reviewText?: string): Promise<{ success: boolean; error?: string }> {
  if (!id && !reviewText) return { success: false, error: 'Missing review identifier' };

  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };

  try {
    if (id && !id.startsWith('abs-en')) {
      const { error } = await supabase
        .from('review_templates')
        .update({ is_used: true })
        .eq('id', id);

      if (error) {
        console.warn('[Supabase Update Notice]', error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    } else if (reviewText) {
      // If generated or fallback, record it in Supabase as used
      const { error } = await supabase
        .from('review_templates')
        .insert([
          {
            business_name: 'Apple Beauty Salon',
            review_text: reviewText.trim(),
            is_used: true,
          },
        ]);

      if (error) {
        console.warn('[Supabase Insert Notice]', error.message);
        return { success: false, error: error.message };
      }
      return { success: true };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Database operation failed';
    return { success: false, error: msg };
  }

  return { success: true };
}
