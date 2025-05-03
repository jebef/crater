import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import qs from 'querystring';
import cors from 'cors';

import { PrismaClient } from '../generated/prisma/client';

import spotifyRoutes from './routes/spotify';

dotenv.config();

const app = express();
const PORT = 3001;
// middleware request to have express parse JSON 
app.use(express.json());
// forgot what this does...
app.use(cors());

app.use('/api/spotify', spotifyRoutes);

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

//const prisma = new PrismaClient();
 
// generates a random string of size 'length'
const generateRandomString = (length: number) => {
    return [...Array(length)]
        .map(() => Math.random().toString(32)[2])
        .join('');
};

const stateKey = 'spotify_auth_state';


// REQUEST/RESPONSE RULES //

app.get('/login', (req, res) => {
    const state = generateRandomString(16);
    const scope = 'user-top-read';

    const queryParams = qs.stringify({
        client_id: SPOTIFY_CLIENT_ID, 
        response_type: 'code',
        redirect_uri: SPOTIFY_REDIRECT_URI,
        scope, 
        state,
    });

    res.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code as string;

    const tokenResponse = await axios.post(
        'https://accounts.spotify.com/api/token',
        qs.stringify({
            code, 
            redirect_uri: SPOTIFY_REDIRECT_URI,
            grant_type: 'authorization_code'
        }),
        {
            headers: {
                Authorization:
                    'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
                    'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );

    const { access_token, refresh_token } = tokenResponse.data;

    // testing
    res.json({ access_token, refresh_token });
});

app.listen(PORT, () => {
    console.log(`Backend listening on http://localhost:${PORT}`);
});