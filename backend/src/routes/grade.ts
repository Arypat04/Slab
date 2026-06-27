import { Router, Request, Response } from 'express';
import { gradeCardImage } from '../services/gemini';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { imageBase64, backImageBase64 } = req.body as { imageBase64?: string; backImageBase64?: string };

  if (!imageBase64 || typeof imageBase64 !== 'string') {
    res.status(400).json({ error: 'imageBase64 is required' });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' });
    return;
  }

  try {
    const result = await gradeCardImage(imageBase64, backImageBase64);
    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[grade]', message);
    res.status(500).json({ error: message });
  }
});

export default router;
