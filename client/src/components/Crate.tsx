import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./Crate.module.css";
import { SimpleSavedAlbum } from '../../../server/src/utils/soptifyTypes';

export default function Crate({ albums }: { albums: SimpleSavedAlbum[] }) {    
    // manage scroll state 
    const [scrollState, setScrollState] = useState({
        index: 0,
        trans: 0,
        isScrolling: false
    });
    
    // info popup state
    const [isOpen, setIsOpen] = useState(false);

    // reference vars to scroller and scroll timeout
    const scrollerRef = useRef<HTMLDivElement>(null);
    const scrollTimeoutRef = useRef<number | null>(null);
    
    // album art info 
    const cover_art_width: number = albums[0].image.width;
    const num_albums: number = albums.length;

    // Handle scrolling logic with improved debouncing
    useEffect(() => {
        const scroller = scrollerRef.current;
        
        function handleScroll(event: Event) {
            // close info popup if open 
            if (isOpen) {
                setIsOpen(false);
            }
            
            // get current scroll position
            const target = event.target as HTMLDivElement;
            const scroll_pos: number = target.scrollTop;
            const newIndex = Math.floor(scroll_pos / cover_art_width);
            const newTrans = (scroll_pos % cover_art_width) / cover_art_width;
            
            // detect if user is actively scrolling by checking for scroll events
            setScrollState({
                index: newIndex,
                trans: newTrans,
                isScrolling: true
            });
            
            // clear any existing timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            
            // set new timeout - scrolling "stops" after defined timeout
            scrollTimeoutRef.current = window.setTimeout(() => {
                setScrollState(prevState => ({
                    ...prevState,
                    isScrolling: false
                }));
            }, 250); 
        }

        if (scroller) {
            scroller.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (scroller) {
                scroller.removeEventListener("scroll", handleScroll);
            }
            
            // clear timeout on cleanup
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [isOpen, cover_art_width]);

    // track if we're in a snap animation
    const isSnappingRef = useRef(false);
    
    // snap to closest album when scrolling stops
    useEffect(() => {
        if (!scrollState.isScrolling && !isSnappingRef.current) {
            const snap_trans = Math.round(scrollState.trans);
            const snap_index = snap_trans === 0 ? scrollState.index : scrollState.index + 1;
            
            // don't snap if we're very close to already being snapped (prevents minor jitter)
            const currentPos = scrollerRef.current?.scrollTop || 0;
            const targetPos = snap_index * cover_art_width;
            const isAlreadyClose = Math.abs(currentPos - targetPos) < 5;
            
            if (!isAlreadyClose) {
                // Mark that we're in a snap animation
                isSnappingRef.current = true;
                
                // Smoothly scroll to the target position
                scrollerRef.current?.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
                
                // Listen for the end of the smooth scroll
                const handleScrollEnd = () => {
                    // After a small delay to ensure animation is complete
                    setTimeout(() => {
                        isSnappingRef.current = false;
                    }, 50);
                };
                
                // One-time scroll event listener to detect end of smooth scroll
                const scroller = scrollerRef.current;
                if (scroller) {
                    const onceListener = () => {
                        handleScrollEnd();
                        scroller.removeEventListener('scrollend', onceListener);
                    };
                    
                    // Try to use scrollend if supported (modern browsers)
                    if ('onscrollend' in window) {
                        scroller.addEventListener('scrollend', onceListener, { once: true });
                    } else {
                        // Fallback for browsers without scrollend event
                        setTimeout(onceListener, 300); // Approximate animation duration
                    }
                }
            }
        }
    }, [scrollState.isScrolling, scrollState.index, scrollState.trans, cover_art_width]);

    // Handle album click 
    const handleClick = useCallback(() => {
        // Don't toggle if we're in the middle of smooth scrolling to prevent conflicts
        const scroller = scrollerRef.current;
        const isManuallyScrolling = scroller && Math.abs(scroller.scrollTop % cover_art_width) > 5;
        
        if (!isManuallyScrolling) {
            setIsOpen(!isOpen);
        }
    }, [isOpen, cover_art_width]);

    // Calculate which albums to display (current and next)
    const currentAlbum = albums[scrollState.index];
    const nextAlbum = scrollState.index + 1 < albums.length ? albums[scrollState.index + 1] : null;

    return (
        // Positioning reference container 
        <div 
            style={{
                width: `${cover_art_width * 2}px`,
                height: `${cover_art_width}px`
            }}
            className={styles['container']}
        >
            {/* Front album */}
            <img 
                className={styles['img-a']}
                style={{
                    height: `${(1 - scrollState.trans) * cover_art_width}px`,
                    width: `${cover_art_width}px`
                }}
                src={currentAlbum.image.url}
                alt={currentAlbum.name}
            />
           
            {/* Back album */}
            {nextAlbum && (
                <div
                    className={styles['img-container-b']}
                    style={{
                        width: `${cover_art_width}px`,
                        height: `${scrollState.trans * cover_art_width}px`
                    }}
                >
                    <img 
                        className={styles['img-b']}
                        style={{
                            opacity: `${scrollState.trans}`,
                            height: `${cover_art_width}px`,
                            width: `${cover_art_width}px`
                        }}
                        src={nextAlbum.image.url}
                        alt={nextAlbum.name}
                    />
                </div>
            )}

            {/* Empty div to allow scrolling */}
            <div 
                className={styles['scroll-tool']}
                ref={scrollerRef}
                style={{
                    height: `${cover_art_width}px`,
                    width: `${cover_art_width}px`,
                    cursor: scrollState.isScrolling? 'auto' : 'pointer'
                }}
                onClick={handleClick}
                onTouchStart={() => {
                    // For mobile - allow interrupting the snap animation
                    if (scrollTimeoutRef.current) {
                        clearTimeout(scrollTimeoutRef.current);
                    }
                }}
            >
                <div
                    style={{
                        height: `${cover_art_width * num_albums}px`,
                        width: `${cover_art_width}px`,
                    }}
                />
            </div>

            {isOpen && <AlbumInfoPop album={currentAlbum} />}
        </div>
    );
}

function AlbumInfoPop({ album }: {album: SimpleSavedAlbum}) {
    return (
        <div className={styles['info-pop']}>
            <h1 className={styles['info']}>{album.name}</h1>
            <h3 className={styles['info']}>{album.artists[0].name}</h3>
            <span className={styles['info']}>{album.release_date}</span>
        </div>
    );
}