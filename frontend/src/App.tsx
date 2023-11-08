//import { useState } from 'react'
import './App.css';
import { useState } from "react";
import Navigation from './components/Navigation/Navigation';
import SocketContextComponent from './components/Socket/Context/Component';
import { BrowserRouter, Routes, Route } from '../node_modules/react-router-dom/dist/index';
import { ContactForm } from './components/Chat/ContactForm';
import { MainPage } from './components/Chat/MainPage';
import { ChatPage } from './components/Chat/ChatPage';
import Room from './components/Chat/Room';

// interface InitialState {
//   route: string;
//   isSignedIn: boolean;
// }

// interface Props {}

// const initialState: InitialState = {
//   route: 'game', // Change when signin is done
//   isSignedIn: true,
// };

const App: React.FC = () => {


	return (
		<SocketContextComponent>
		<div className='App'>
			<BrowserRouter>
				<Routes>
					<Route  path='/' element={<MainPage/>}/>
					<Route path='/subscribe' element={<ContactForm/>} />
					<Route path='/chat' element={<ChatPage/>} />
					<Route path='/chat/room/:id' element={<Room/>}/>
				</Routes>
			</BrowserRouter>
		</div>
		</SocketContextComponent>
	)
//   const [initState, setInitialState] = useState(initialState);

//   const onRouteChange = (route: string): void => {
//     if (route === 'signout') {
//       setInitialState(initialState);
//     } else if (route === 'game' || route === 'profile' || route === 'chat' || route === 'pong') {
//       setInitialState({...initState, isSignedIn: true});
//     }
//     setInitialState({...initState, route: route});
//   }

//   return (
//     <div className="App">
//       {
//         (initState.route === 'game' || initState.route === 'chat' || initState.route === 'profile' || initState.route === 'pong') 
//         ?
//           <Navigation isSignedIn={initState.isSignedIn} onRouteChange={onRouteChange}/>
//         : (
//           initState.route === 'signin' 
//           ? '' /* <Signin onRouteChange={this.onRouteChange}/> */
//           : '' /* <Register={this.onRouteChange)/> */
//         )
//       }
//     </div>
//   );
}

export default App;
