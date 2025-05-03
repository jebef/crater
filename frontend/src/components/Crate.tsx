import { useState, useEffect, useRef } from "react";
import AlbumWidget, {Album} from "./AlbumWidget";
import styles from "./Crate.module.css";


const images: string[] = [
    'https://i.scdn.co/image/ab67616d00001e02a2d982ac1153364d1fd5786f',
    'https://i.scdn.co/image/ab67616d00001e02dbd750dcc2119ce18a09ff53',
    'https://i.scdn.co/image/ab67616d00001e02c81d58180513e2dce1b64593',
    'https://i.scdn.co/image/ab67616d00001e021c76d0633a2b06b2b76e1a44',
    'https://i.scdn.co/image/ab67616d00001e02b9dd63a105a5afe5d58a783b',
    'https://i.scdn.co/image/ab67616d00001e02c177aec7fed6d6e8f1969534',
    'https://i.scdn.co/image/ab67616d00001e0268999d8c8a0c2fd829d83d4d'
];

export default function Crate({albums}: {albums: Album[]} ) {
    const [index, setIndex] = useState(0);
    const [trans, setTrans] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    // scrolling state
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [isScrolling, setIsScrolling] = useState(false);
    const [timeoutID, setTimeoutID] = useState<number | null>(null);

    // album info 
    const cover_art_width: number = albums[0].cover_images[1].img_width;
    const num_albums: number = albums.length;

    // function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    //     // console.log("Scroll pos:", e.currentTarget.scrollTop);
    //     // console.log("Index:",Math.floor(e.currentTarget.scrollTop / cover_art_width))
    //     // console.log("Percent trans:", e.currentTarget.scrollTop % cover_art_width / cover_art_width)

    //     // update state variable 
    //     if (!isScrolling) {
    //         setIsScrolling(true);
    //     }

    //     // trash old timeout ID 
    //     if (timeoutID) { 
    //         clearTimeout(timeoutID);
    //     }

    //     // set new timeout ID, scrolling "stops" after 100ms of inactivity
    //     const newTimeoutID = setTimeout(() => {
    //         setIsScrolling(false);
    //     }, 100);
    //     setTimeoutID(newTimeoutID);

    //     const scroll_pos: number = e.currentTarget.scrollTop;
    //     setIndex(Math.floor(scroll_pos / cover_art_width));
    //     setTrans(scroll_pos % cover_art_width / cover_art_width)
    // }

    useEffect(() => {
        const scroller = scrollerRef.current;

        function handleScroll(event: Event) {
            // update state variable 
            if (!isScrolling) {
                setIsScrolling(true);
                console.log("is scrolling!")
            }
            // trash old timeout ID 
            if (timeoutID) { 
                clearTimeout(timeoutID);
            }
            // set new timeout ID, scrolling "stops" after 500ms of inactivity
            const newTimeoutID = setTimeout(() => {
                setIsScrolling(false);
                console.log("not scrolling!");
            }, 1000);
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

      useEffect(() => {
        if (!isScrolling) {
            setTrans(Math.round(trans));
        }
    }, [isScrolling]);

    // useEffect(() => {
    //     if (trans == 1) {
    //         setIndex(index + 1);
    //     }
    // }, [trans]);
    



    function handleClick() {
        console.log("Clicked");
    }

    return (
        <div 
        style={{
            width: `${cover_art_width}px`,
            height: `${cover_art_width}px`
        }}
        className={styles['container']}
        >
            <div 
            className={styles['img-container-a']}
            style={{
                width: `${cover_art_width}px`,
                height: `${cover_art_width}px`
            }}
            >
                <img 
                className={styles[`img-a${!isScrolling ? '-static' : ''}`]}
                // className={styles['img-a']}
                style={{
                    height: `${(1 - trans) * cover_art_width}px`,
                    width: `${cover_art_width}px`
                }}
                // src={albums[index].cover_images[1].img_url}
                src={images[index]}
                />
            </div>
        
            <div
            className={styles[`img-container-b${!isScrolling ? '-static' : ''}`]}
            style={{
                width: `${cover_art_width}px`,
                height: `${(trans) * cover_art_width}px`
            }}
            >
                <img 
                className={styles[`img-b${!isScrolling ? '-static' : ''}`]}
                style={{
                    opacity: `${trans}`,
                    height: `${cover_art_width}px`,
                    width: `${cover_art_width}px`
                }}
                // src={albums[index].cover_images[1].img_url}
                src={images[index + 1]}
                />
            </div>

            <div 
            className={styles['scroll-tool']}
            ref={scrollerRef}
            style={{
                height: `${cover_art_width}px`,
                width: `${cover_art_width}px`
            }}
            // onScroll={handleScroll}
            onClick={handleClick}
            >
                <div
                style={{
                    height: `${cover_art_width * num_albums}px`,
                    width: `${cover_art_width}px`,
                }}
                />
            </div>
        </div>
    );
}