import { useContext } from 'react';
import SocketContext from '../Socket/Context/Context';

export default function Messages ({messages, from}: {messages:string[], from: string}) {
	const { SocketState } = useContext(SocketContext);
	
	return  <div>
			<div>{SocketState.uid}</div>
			{ messages.map((message, index) => (
				<div key={index}>{from + ': ' + message}</div>
			))}
		</div>
}