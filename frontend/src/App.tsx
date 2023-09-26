//import { useState } from 'react'
import { Component } from "react";
import './App.css';
import { Route, Routes } from "react-router-dom";
import Profile from "./components/Profile/Profile";

interface InitialState {
  route: string;
  isSignedIn: boolean;
}

interface Props {}

const initialState: InitialState = {
  route: 'profile', // Change when signin is done
  isSignedIn: true,
};

class App extends Component<Props, InitialState> {
  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

  onRouteChange = (route: string): void => {
    if (route === 'signout') {
      this.setState(initialState);
    } else if (route === 'game' || route === 'profile' || route === 'chat' || route === 'pong') {
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, route }: {isSignedIn: boolean; route: string } = this.state;
    
    return (
      <>
        {
          (route === 'game' || route === 'chat' || route === 'profile' || route === 'pong') 
          ? ( 
            <div className="App">
              <Routes>
                {/* <Route path='/' element={<Navigation />} > */}
                  <Route path='profile' element={<Profile onRouteChange={this.onRouteChange} />} />
                {/* </Route> */}
              </Routes>
            </div>
          )
          : (
            route === 'signin' 
            ? '' /* <Signin onRouteChange={this.onRouteChange}/> */
            : '' /* <Register={this.onRouteChange)/> */
          )
        }
      </>
    );
  }
}

export default App;
