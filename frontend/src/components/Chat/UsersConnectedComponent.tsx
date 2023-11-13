import React, { useContext, useEffect, useState } from 'react'
import SocketContext from '../Socket/Context/Context';

export default function UsersConnectedComponent() {

	const {SocketState} = useContext(SocketContext);
	const [usersConnected, setUsersConnected] = useState<string[]>([]);

	const usersListener = (data : {type: string, user: string}) => {
		console.log('et par ici');
		if (data.type === 'new')
			setUsersConnected([...usersConnected, data.user]);
	};

	useEffect(() => {
		if(SocketState.socket) {
			SocketState.socket.on('usersConnected', usersListener);
		}
		return () => {
			SocketState.socket?.off('usersConnected', usersListener);
		}
		// eslint-disable-next-line
	}, [usersListener]);

	return (
		<div>Users Connected : {usersConnected}</div>
	);
}