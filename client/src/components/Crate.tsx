import { useState, useEffect, useRef } from "react";
import styles from "./Crate.module.css";
import { SimpleSavedAlbum } from '../../../server/src/utils/soptifyTypes';

let albums: SimpleSavedAlbum[] = [];

const getSavedAlbums = async () => {
    try {
        const res = await fetch('http://127.0.0.1:3001/api/spotify/albums', {
            method: 'GET',
            credentials: 'include', // SENDS COOKIES!
        });

        albums = await res.json();

    } catch (err: any) {
        console.error(err);
    }
}


export default function Crate() {
    // get data from back end 
    useEffect(() => {
        getSavedAlbums();
    },[]);

    const [index, setIndex] = useState(0);
    const [trans, setTrans] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    // scrolling state
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const [timeoutID, setTimeoutID] = useState<number | null>(null);

    // album info 
    const cover_art_width: number = albums[0].image.width;
    const num_albums: number = albums.length;

    // handles most of our scrolling logic 
    useEffect(() => {
        const scroller = scrollerRef.current;

        function handleScroll(event: Event) {
            // close info popup if open 
            if (isOpen) {
                setIsOpen(false);
            }
            // update state variable 
            if (!isScrolling) {
                setIsScrolling(true);
                // console.log("is scrolling!")
            }
            // trash old timeout ID 
            if (timeoutID) { 
                clearTimeout(timeoutID);
            }
            // set new timeout ID, scrolling "stops" after 500ms of inactivity
            const newTimeoutID = setTimeout(() => {
                setIsScrolling(false);
                // console.log("not scrolling!");
            }, 100);
            setTimeoutID(newTimeoutID);
            // update other state var
            const target = event.target as HTMLDivElement; // this is kinda wack 
            const scroll_pos: number = target.scrollTop; 
            setIndex(Math.floor(scroll_pos / cover_art_width));
            setTrans(scroll_pos % cover_art_width / cover_art_width)
        }

        if (scroller) {
            scroller.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (scroller) {
                scroller.removeEventListener("scroll", handleScroll);
            }
        };
      }, [isScrolling, timeoutID]);


      // snap to closest album when scrolling stops 
      useEffect(() => {
        if (!isScrolling) {
            const snap_trans = Math.round(trans);
            const snap_index = snap_trans == 0 ? index : index + 1;
            // both 'index' and 'trans' are calculated using the 'scrollTop' value,
            // therefore updating the scroll position indirectly updates 'index' and 'trans'
            scrollerRef.current?.scrollTo({
                top: snap_index * cover_art_width,
                behavior: 'smooth'
            });
        }
    }, [isScrolling]);

    // handles album click 
    function handleClick() {
        // console.log("Clicked");
        setIsOpen(!isOpen);
    }

    return (
        // positioning reference container 
        <div 
        style={{
            width: `${cover_art_width * 2}px`,
            height: `${cover_art_width}px`
        }}
        className={styles['container']}
        >
            {/* front album  */}
            <img 
            className={styles['img-a']}
            style={{
                height: `${(1 - trans) * cover_art_width}px`,
                width: `${cover_art_width}px`
            }}
            src={albums[index].image.url}
            />
           
            {/* back album  */}
            <div
            className={styles['img-container-b']}
            style={{
                width: `${cover_art_width}px`,
                height: `${(trans) * cover_art_width}px`
            }}
            >
                <img 
                className={styles['img-b']}
                style={{
                    opacity: `${trans}`,
                    height: `${cover_art_width}px`,
                    width: `${cover_art_width}px`
                }}
                src={albums[index + 1]?.image.url}
                />
            </div>

            {/* empty div to allow scrolling */}
            <div 
            className={styles['scroll-tool']}
            ref={scrollerRef} // a reference to our scroller div to track scrolling events 
            style={{
                height: `${cover_art_width}px`,
                width: `${cover_art_width}px`,
                pointerEvents: isScrolling? 'none' : 'auto',
                cursor: isScrolling? 'auto' : 'pointer'
            }}
            onClick={isScrolling? undefined : handleClick}
            >
                <div
                style={{
                    height: `${cover_art_width * num_albums}px`,
                    width: `${cover_art_width}px`,
                }}
                />
            </div>

            {isOpen && <AlbumInfoPop album={albums[index]}/>}
        </div>
    );
}

function AlbumInfoPop({ album }: {album: SimpleSavedAlbum}) {
    return (
        <div
            className={styles['info-pop']}
        >
            <h1 className={styles['info']}>
            {album.name}
            </h1>
            <h3 className={styles['info']}>{album.artists[0].name}</h3>
            <span className={styles['info']}>{album.release_date}</span>
        </div>
    );
}