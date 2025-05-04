// simplified types 
export interface SimpleSavedAlbum {
    added_at: string;
    album_type: string;
    image: Image;
    name: string;
    release_date: string;
    artists: SimpleArtist[];
}

export interface SimpleArtist { 
    name: string;
}

// spotify api types 
export interface SavedAlbum {
    added_at: string;
    album: Album;
}

export interface Album {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: Restrictions;
    type: string;
    uri: string;
    artists: Artist[];
    tracks: Tracks;
    copyrights: Copyright[];
    external_ids: ExternalIds;
    genres: string[];
    label: string;
    popularity: number;
}

export interface ExternalUrls { 
    spotify: string;
}

export interface Image {
    url: string;
    height: number;
    width: number;
}

export interface Restrictions {
    reason: string;
}

export interface Artist {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

export interface Tracks {
    href: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
    items: Track[];
}

export interface Track {
    artists: Artist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    is_playable: boolean;
    linked_from: LinkedFrom;
    restrictions: Restrictions;
    name: string;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
}

export interface LinkedFrom {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    type: string;
    uri: string;
}

export interface Copyright {
    text: string;
    type: string;
}

export interface ExternalIds {
    isrc: string;
    ean: string;
    upc: string;
}