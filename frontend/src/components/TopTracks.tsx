// src/components/TopTracks.tsx

import { useEffect, useState } from 'react';

interface Track {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  id: string;
}

function TopTracks({ accessToken }: { accessToken: string }) {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    const fetchTopTracks = async () => {
      const res = await fetch('http://localhost:3001/api/spotify/top-tracks', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await res.json();
      setTracks(data.items);
    };

    if (accessToken) fetchTopTracks();
  }, [accessToken]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Top Tracks</h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tracks.map((track) => (
          <li key={track.id} className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg">
            <img src={track.album.images[0].url} alt="album art" className="w-16 h-16 rounded" />
            <div>
              <p className="font-semibold">{track.name}</p>
              <p className="text-sm text-gray-600">{track.artists.map((a) => a.name).join(', ')}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TopTracks;