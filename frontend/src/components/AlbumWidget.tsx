
import { useState } from "react";
import styles from "./AlbumWidget.module.css";


// authorization scope -> user-library-read 

export interface Album {
    name: string;
    artists: string[];
    cover_images: CoverArt[];
    track_list: Track[];
    release_type: string; // 'album', 'single', 'compilation'
    release_date: string; // '2009', '1981-12', '2009-03-24'
    release_date_precision: string; // 'year', 'month', 'day'
    copyrights: Copyright[];
    popularity: number; // 0-100
    added_at: string; // 'YYYY-MM-DDTHH:MM:SSZ'
};

export interface CoverArt {
    img_url: string;
    img_width: number;
    img_height: number;
}

export interface Track {
    name: string;
    number: number;
}

export interface Copyright {
    text: string; // '2009 Carpark Records'
    type: string; // 'C' - copyright, 'P' - performance copyright
}



export default function AlbumWidget({ album }: {album: Album}) {
    // state variables 
    const [isActive, setIsActive] = useState(false);

    // update state based on user input 
    function handleClick() {
        setIsActive(!isActive);
    }

    return (
        <div className={styles['widget']}>
            <img
                className={styles['button']}
                alt={`${album.name}`}
                src={album.cover_images[1]?.img_url || ''}
                onClick={handleClick}
            />
            {isActive && <AlbumInfoPop album={album}/>}
        </div>
    );
}

function AlbumInfoPop({ album }: {album: Album}) {
    return (
        <div
            className={styles['info-pop']}
        >
            <h1 className={styles['info']}>
            {album.name}
            </h1>
            <h3 className={styles['info']}>{album.artists}</h3>
            <span className={styles['info']}>{album.release_date}</span>
        </div>
    );
}