//import { useState } from 'react'
import './App.css';
import { useState } from "react";
import Navigation from './components/Navigation/Navigation';
import SocketContextComponent from './components/Socket/Context/Component';
import Game from './components/Game/Game';

interface InitialState {
  route: string;
  isSignedIn: boolean;
}

interface Props {}

const initialState: InitialState = {
  route: 'game', // Change when signin is done
  isSignedIn: true,
};

const App: React.FC = () => {

  const [initState, setInitialState] = useState(initialState);

  const onRouteChange = (route: string): void => {
    if (route === 'signout') {
      setInitialState(initialState);
    } else if (route === 'game' || route === 'profile' || route === 'chat' || route === 'pong') {
      setInitialState({...initState, isSignedIn: true});
    }
    setInitialState({...initState, route: route});
  }

  return (
    <div className="App">
      <SocketContextComponent>
        {
          (initState.route === 'game' || initState.route === 'chat' || initState.route === 'profile' || initState.route === 'pong') 
          ?
            <Navigation isSignedIn={initState.isSignedIn} onRouteChange={onRouteChange}/>
          : (
            initState.route === 'signin' 
            ? '' /* <Signin onRouteChange={this.onRouteChange}/> */
            : '' /* <Register={this.onRouteChange)/> */
          )
        }
        <Game className="canvasGame" width={800} height={600} />
      </SocketContextComponent>
    </div>
  );
}

export default App;
