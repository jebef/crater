import { Request, Response } from 'express';
import axios from 'axios';
import { generateCodeVerifier, sha256, base64encode } from '../utils/pkce';
import { SimpleSavedAlbum, Image, SimpleArtist } from '../utils/soptifyTypes';

export const spotifyLogin = async (req: Request, res: Response) => {
    // generate code verifier and challenge 
    const code_verifier = generateCodeVerifier(64);
    const hashed = await sha256(code_verifier);
    const code_challenge = base64encode(hashed);

    // save code verifier in a cookie 
    res.cookie('code_verifier', code_verifier, {
        httpOnly: true,
        secure: false,
        maxAge: 10 * 60 * 1000, // 10min expiration 
    });

    // get consts from .env 
    const client_id = process.env.SPOTIFY_CLIENT_ID!;
    const redirect_uri = process.env.SPOTIFY_REDIRECT_URI!;
    const scope = process.env.SPOTIFY_SCOPE!;
    const auth_endpoint = process.env.SPOTIFY_AUTH_ENDPOINT!;

    // define parameters for authorization request 
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: client_id,
        redirect_uri: redirect_uri,
        code_challenge_method: 'S256',
        code_challenge: code_challenge,
        scope: scope
    });

    // redirect to authorization endpoint 
    const auth_url = new URL(auth_endpoint);
    auth_url.search = params.toString();
    res.redirect(auth_url.toString());
};

export const spotifyCallback = async (req: Request, res: Response): Promise<any> => { 
    // retrieve the code from the response url 
    const code = req.query.code as string;
    const code_verifier = req.cookies.code_verifier;

    // error checking 
    if (!code) { 
        return res.status(400).json({ error: 'Missing code!' });
    }
    if (!code_verifier) { 
        return res.status(400).json({ error: 'Missing code verifier!' });
    }

    // define payload for POST request 
    const payload = new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID!,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI!, // NO ACTUAL REDIRECT, FOR VERIFACTION 
        code_verifier: code_verifier
    });

    // send request to spotify's token endpoint to exchange code for token
    try {
        const response = await axios.post(process.env.SPOTIFY_TOKEN_ENDPOINT!, payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        // store token information as cookies 
        const tokens = response.data;
        res.cookie('access_token', tokens.access_token, {
            httpOnly: true,
            secure: false,
            maxAge: tokens.expires_in * 1000 // 1hr 
        });
        res.cookie('refresh_token', tokens.refresh_token, {
            httpOnly: true,
            secure: false
        });

        // set front end success flag 
        res.redirect('https://localhost:5173?isLoggedIn=true');
        res.json({ isLoggedIn: true });
        // TODO: fix routing back to front end 

    } catch (err: any) {
        console.error('Token exchange error:', err.response?.data || err.message);
        return res.status(500).json({ error: 'Failed to exchange code for token!' });
    }
};


export const spotifyGetSavedAlbums = async (req: Request, res: Response): Promise<any> => {
    // retrieve access token from cookies
    const access_token = req.cookies.access_token;
    // error handling
    if (!access_token) {
        return res.status(401).json({ error: 'No access token!' });
    }

    try {
        const response = await axios.get('https://api.spotify.com/v1/me/albums', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        // send saved album data 
        // res.json(response.data); // DEBUG
        let result: SimpleSavedAlbum[] = [];
        for (const item of response.data.items) {
            // capture image data 
            const image: Image = {
                url: item.album.images[1].url,
                height: item.album.images[1].height,
                width: item.album.images[1].width
            };
            // capture artists info 
            let artists: SimpleArtist[] = [];
            for (const artist of item.album.artists) {
                const a: SimpleArtist = {
                    name: artist.name
                };
                artists.push(a);
            }
            // capture/compile album info 
            const album: SimpleSavedAlbum= {
                added_at: item.added_at,
                album_type: item.album.album_type,
                image: image,
                name: item.album.name,
                release_date: item.album.release_date,
                artists: artists
            };
            result.push(album);
        }
        // send album data as json 
        console.log(result);
        res.json(result);

    } catch (err: any) {
        console.error('Failed to fetch saved albums:', err.response?.data || err.message);
        return res.status(500).json({ error: 'Failed to fetch saved albums' });
    }
};




