import { useEffect, useState } from 'react';
import './App.css';
import SpotifyLoginButton from './components/SpotfyLoginButton';
import CrateLoader from './components/CrateLoader';

// interface SpotifyDetails {
//   loggedInWithSpotify: boolean
// }


// use react query to "cache" the UserDetails state so 
// we can reference it in any place in our project

// on the backend, you will want to make a "GET" request
// for the User object

// loggedInWithSpotify = true

// useQuery(data, dataIsLoading, dataIsError) {
//   spotifyDetailsApi.getMe(), "spotify"       # fetch(localhost:3001/api/spotify)
// }

// Case 1: show some page when there data.loggedInWithSpotify is false
// probably should just be a login button
// this case should probably be it's own component

// Case 2: show the loading, error, and successful state
// of hitting ANOTHER endpoint that uses the backend's
// cookie to get your spotify albums

// when loading, show something temporary like "fetching your albums"

// if error show something red

// If successful, simply list out the album id's or whatever's easiest


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    const isLoggedIn = params.get('isLoggedIn') === 'true';
    if (isLoggedIn) {
      setIsLoggedIn(true);
      // restore normal url 
      window.history.replaceState({}, '', '/');
    }
  }, []);


  return (
    <div>
      {!isLoggedIn && <SpotifyLoginButton/>}
      {isLoggedIn && <CrateLoader/>}
    </div>
  )
}

export default App
