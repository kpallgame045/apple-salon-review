import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleGenerateReviewRequest } from '../src/server/generateReviewHandler';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const body = req.body || {};
    const result = await handleGenerateReviewRequest(body, process.env as Record<string, string>);
    return res.status(200).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return res.status(500).json({ success: false, error: message });
  }
}
