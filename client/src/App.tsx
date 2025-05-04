import { useEffect, useState } from 'react';
import './App.css';
import SpotifyLoginButton from './components/SpotfyLoginButton';
import Crate from './components/Crate';

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
      <SpotifyLoginButton/>
      {isLoggedIn && <Crate/>}
    </div>
  )
}

export default App
