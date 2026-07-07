import express from 'express';
const router = express.Router();

router.post('/login', async (req, res) => {
  res.json({ message: 'login ok (por implementar)' });
});

export default router;