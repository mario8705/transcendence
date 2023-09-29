// import { useContext, useEffect, useState } from 'react';
// import SocketContext from '../contexts/Socket/Context';
import SocketChatComponent from '../SocketChatComponent'

export const ChatPage = ()  => {
	// const { SocketState } = useContext(SocketContext);
	// const [users, setUsers] = useState<string[]>([]);

	// SocketState.socket?.emit('getUsers');

	// useEffect(() => {
	// 	interface Params {
	// 		name: string,
	// 		id : string
	// 	}
	// 	if (SocketState.socket) {
	// 		SocketState.socket?.on('updateUsers', (users : { ones : {}} ) => {
	// 			const allusers : string[] = [];
	// 			allusers.push();
	// 			setUsers();
	// 		});
	// 	}
	//   }, [SocketState.socket]);

	return (
		<div>
		<h1>Conversations</h1>
		{/* <div>
			{users.map((index) => (
				<div key={index}>{index}</div>
			))}
		</div> */}
			<SocketChatComponent />
		</div>
	)
}
