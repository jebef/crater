import { useEffect } from "react";
import TopTracks from "./components/TopTracks";
import AlbumWidget, { Album, CoverArt, Track, Copyright } from "./components/AlbumWidget";

import Crate from "./components/Crate";

function App() {
  useEffect(() => {
    fetch("http://localhost:3001")
      .then((res) => res.text())
      .then((data) => console.log(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  const cover_images_test: CoverArt[] = [
    {
      img_url: 'https://i.scdn.co/image/ab67616d0000b2735fb61d76e5eb2633a1c0cfaf',
      img_width: 640,
      img_height: 640
    },
    {
      img_url: 'https://i.scdn.co/image/ab67616d00001e025fb61d76e5eb2633a1c0cfaf',
      img_width: 300,
      img_height: 300
    },
    {
      img_url: 'https://i.scdn.co/image/ab67616d000048515fb61d76e5eb2633a1c0cfaf',
      img_width: 64,
      img_height: 64
    }
  ];

  const tracks_test: Track[] = [
    { name: 'Build Voice', number: 1},
    { name: 'Red F', number: 2},
    { name: 'Paddling Ghost', number: 3},
    { name: 'Snookered', number: 4},
    { name: 'Of The Mountains', number: 5},
    { name: 'Surprise Stefani', number: 6},
    { name: 'Wet Wings', number: 7},
    { name: 'Woof Woof', number: 8},
    { name: 'Slow With Horns / Run For Your Life', number: 9},
    { name: 'Baltihorse', number: 10},
    { name: 'Get Older', number: 11}
  ];

  const copyrights_test: Copyright[] = [
    {
      text: "2009 Carpark Records",
      type: "C"
    },
    {
      text: "2009 Carpark Records",
      type: "P"
    }
  ];

  const album_test: Album = {
    name: 'Bromst',
    artists: ['Dan Deacon'],
    cover_images: cover_images_test,
    track_list: tracks_test,
    release_type: 'album',
    release_date: '2009-03-24',
    release_date_precision: 'day',
    copyrights: copyrights_test,
    popularity: 26, // 0-100
    added_at: '2025-05-01T23:37:38Z'
  };

  const albums_test: Album[] = [
    album_test,
    album_test,
    album_test,
    album_test,
    album_test,
    album_test,
    album_test
  ];


  return (
    <div className="App">
      {/* <TopTracks accessToken={"BQBTvaOXkoxCPb8ZJgFDJJlZxgPq6eJjLb0QW-fuccliCEkm6vNmA8dzmk7_QWDIRBwd9ooj01A48ckJ0LKozbZnpe7tXccHsIcuQks5veBHxyx7x40oroxnPcpYfDQrHCh5QMc6MMtfkZrA8V0Jzm0j7jfLK3oO3sdKVXH2AJGsd2rYfOlV7Tm-oniTp87Roado600taLwULXNWeGyd0urJJI5ufw"}/> */}
      <AlbumWidget album={album_test}/>
      <Crate albums={albums_test}/>

    </div>
  );
}

export default App;
