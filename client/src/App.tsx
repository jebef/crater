import { useEffect, useState } from 'react';
import './App.css';
import LandingPage from './pages/LandingPage';
import CrateLoader from './components/CrateLoader';


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
      {!isLoggedIn && <LandingPage/>}
      {isLoggedIn && <CrateLoader/>}
    </div>
  )
}

export default App
