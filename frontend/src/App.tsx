import { useState } from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";

import Navigation from './components/Navigation/Navigation';
import Profile from "./components/Profile/Profile";
import LoginForm from './components/LoginForm/LoginForm';

import './App.css';


const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(true);
  const navigate = useNavigate();

  const onRouteChange = (route: string): void => {
    if (route === 'signout') {
      setIsSignedIn(false);
      navigate('/signin');
    } else if (route === 'game' || route === 'profile' || route === 'chat' || route === 'pong' || route === 'friends') {
      setIsSignedIn(true);
      navigate(`/${route}`);
    } else if (route === 'signin') {
      setIsSignedIn(false);
      navigate(`/${route}`);
    }
  }

  return (
    <>
      <div className="App">
        <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
        <Routes>
            <Route path='/profile' element={<Profile onRouteChange={onRouteChange} />} />
            <Route path='/friends' element={<Profile onRouteChange={onRouteChange} />} />
            <Route path='/signin' element={<LoginForm onRouteChange={onRouteChange} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
