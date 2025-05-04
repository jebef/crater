import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import spotifyRoutes from './routes/spotifyRoutes'; // this is the 'router' obj that is default exported 

// load environment variables from .env 
dotenv.config();

// create a new express app 
const app = express();
const PORT = process.env.SERVER_PORT;

// middleware 
// security settings for communication between servers 
app.use(cors({
    origin: 'http://127.0.0.1:5173',
    credentials: true
})); 
app.use(express.json()); // parse JSON bodies 
app.use(cookieParser()); // cookies!

// routes 
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// spotifty api routes
app.use('/api/spotify', spotifyRoutes);

// start backend server
app.listen(PORT, () => {
    console.log(`Backend server listening on http://localhost:${PORT}`);
});

