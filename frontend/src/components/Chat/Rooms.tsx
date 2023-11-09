import React, { useContext, useEffect, useState } from 'react'
import SocketContext from '../Socket/Context/Context';
import RoomsList from './RoomsList';

export default function Rooms() {
	const {SocketState} = useContext(SocketContext);
	const [room, setRoom] = useState('');
	const [rooms, setRooms] = useState<string[]>([]);
	
	const joinRoom = () => {
		SocketState.socket?.emit('room', {type: 'join', roomname: room, option: {invite: false, key: false, value: ''}});
	}

	const exitRoom = () => {
		SocketState.socket?.emit('room', {type: 'exit', roomname: room, option: {invite: false, key: false, value: ''}});
	}
	
	const RoomListener = (data: {type: string, room: string}) => {
		if (data.type === 'add') {
			setRooms([...rooms, data.room])
			return;
		}
		else if (data.type === 'delete') {
			console.log('je ne sais pas encore comment faire');
		}
	};

	useEffect(() => {
		if (SocketState.socket) {
			SocketState.socket.on('roomupdate', RoomListener);
		};
		return() => {
			SocketState.socket.off('roomupdate', RoomListener);
		}
	}, [RoomListener]);

	return (
		<div>
			<input
				type="text"
				placeholder="join Room"
				value={room}
				onChange={(e) => setRoom(e.target.value)}
			/>
			<div>{room}</div>
			<button onClick={joinRoom}>Join</button>
			<br></br>
			<input
				type="text"
				placeholder="exit Room"
				value={room}
				onChange={(e) => setRoom(e.target.value)}
			/>
			<div>{room}</div>
			<button onClick={exitRoom}>Exit</button>
			<br></br>
			<div>Enter Excisting Room:</div>
			<RoomsList className='conversations' rooms={rooms}/>
		</div>
	);
}