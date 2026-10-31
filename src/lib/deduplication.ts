/**
 * Text normalization and duplicate detection utilities
 * for Apple Beauty Salon Review Generator
 */

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0A80-\u0AFF\u0900-\u097F]/g, ' ') // preserves English, Gujarati, Hindi Unicode
    .replace(/\s+/g, ' ')
    .trim();
}

export function hashText(text: string): string {
  const norm = normalizeText(text);
  let hash = 0;
  for (let i = 0; i < norm.length; i++) {
    const char = norm.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

export function getOpeningSentence(text: string): string {
  const match = text.trim().match(/^([^.!?\n]+[.!?]?)/);
  return match ? match[1].trim() : text.slice(0, 60).trim();
}

/**
 * Calculates Character Trigram Similarity (Dice coefficient) between two texts.
 * Range: 0.0 (completely distinct) to 1.0 (identical).
 */
export function calculateTrigramSimilarity(a: string, b: string): number {
  const normA = normalizeText(a);
  const normB = normalizeText(b);

  if (normA === normB) return 1.0;
  if (normA.length < 3 || normB.length < 3) {
    return normA === normB ? 1.0 : 0.0;
  }

  const getTrigrams = (str: string): Map<string, number> => {
    const map = new Map<string, number>();
    for (let i = 0; i < str.length - 2; i++) {
      const tri = str.substring(i, i + 3);
      map.set(tri, (map.get(tri) || 0) + 1);
    }
    return map;
  };

  const mapA = getTrigrams(normA);
  const mapB = getTrigrams(normB);

  let matches = 0;
  for (const [tri, countA] of mapA.entries()) {
    const countB = mapB.get(tri) || 0;
    matches += Math.min(countA, countB);
  }

  const totalA = normA.length - 2;
  const totalB = normB.length - 2;

  return (2 * matches) / (totalA + totalB);
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  reason?: 'exact_hash' | 'near_duplicate' | 'identical_opening';
  highestSimilarity: number;
  conflictingText?: string;
}

export function checkDuplicate(
  candidateText: string,
  existingReviews: string[],
  threshold = 0.70
): DuplicateCheckResult {
  const candidateHash = hashText(candidateText);
  const candidateOpening = getOpeningSentence(candidateText);

  let highestSim = 0;
  let conflict: string | undefined;

  for (const existing of existingReviews) {
    // 1. Exact hash check
    if (hashText(existing) === candidateHash) {
      return {
        isDuplicate: true,
        reason: 'exact_hash',
        highestSimilarity: 1.0,
        conflictingText: existing,
      };
    }

    // 2. Exact opening sentence check (to avoid repeated openers)
    if (getOpeningSentence(existing) === candidateOpening) {
      return {
        isDuplicate: true,
        reason: 'identical_opening',
        highestSimilarity: 0.95,
        conflictingText: existing,
      };
    }

    // 3. Trigram similarity check
    const sim = calculateTrigramSimilarity(candidateText, existing);
    if (sim > highestSim) {
      highestSim = sim;
      conflict = existing;
    }

    if (sim >= threshold) {
      return {
        isDuplicate: true,
        reason: 'near_duplicate',
        highestSimilarity: sim,
        conflictingText: existing,
      };
    }
  }

  return {
    isDuplicate: false,
    highestSimilarity: highestSim,
    conflictingText: conflict,
  };
}
