import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import gradeRouter from './routes/grade';
import searchRouter from './routes/search';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/grade', gradeRouter);
app.use('/api/search-cards', searchRouter);

app.listen(PORT, () => {
  console.log(`CardGrader backend running on http://localhost:${PORT}`);
});
