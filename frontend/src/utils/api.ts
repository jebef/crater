// API HANDLERS HERE // 

// Fetch top tracks from spotify API
export async function fetchTopTracks(accessToken: string) {
    const response = await fetch('http://localhost:;3001/api/spotify/top-tracks', {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch top tracks');
    }

    return response.json();
}