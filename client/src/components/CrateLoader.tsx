import { useState, useEffect } from "react";
import Crate from "./Crate"; 
import { SimpleSavedAlbum } from "../../../server/src/utils/soptifyTypes";

export default function CrateLoader() {
    const [albums, setAlbums] = useState<SimpleSavedAlbum[] | null>(null);

    useEffect(() => {
        const getSavedAlbums = async () => {
            try {
                const res = await fetch('http://127.0.0.1:3001/api/spotify/albums', {
                    credentials: 'include'
                });
                const data = await res.json();
                setAlbums(data);
            } catch (err) {
                console.error(err);
            }
        };
        getSavedAlbums();
    }, []);

    if (albums === null) return <div>Loading albums...</div>;

    return <Crate albums={albums} />;
}
