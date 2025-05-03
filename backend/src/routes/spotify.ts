import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.get('/top-tracks', async (req, res): Promise<any> => {
  const accessToken = req.headers.authorization?.split(' ')[1]; // Expecting: Bearer <token>

  if (!accessToken) {
    return res.status(401).json({ error: 'Missing access token' });
  }

  try {
    const response = await axios.get('https://api.spotify.com/v1/me/top/tracks?limit=5', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return res.json(response.data);
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    return res.status(500).json({ error: 'Failed to fetch top tracks' });
  }
});

export default router;
