import { Router } from 'express';
import { spotifyLogin, spotifyCallback, spotifyGetSavedAlbums} from '../controllers/spotifyControllers';

const router = Router();

router.get('/login', spotifyLogin);

router.get('/callback', spotifyCallback);

router.get('/albums', spotifyGetSavedAlbums);

export default router;