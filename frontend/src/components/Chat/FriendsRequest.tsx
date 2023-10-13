import React, { useContext, useEffect, useState } from 'react'
import SocketContext from '../Socket/Context/Context';

export default function RequestFriend() {
	// const [value, setValue] = useState("");
	const {SocketState} = useContext(SocketContext);
	const [newFriend, setNewFriend] = useState('');
	const [friends, setFriends] = useState<string[]>([]);

	const friendsListener = (data : {type: string, from: string, friend: string, status: string}) => {
		console.log('et par ici');
		if (data.type === 'new')
			setFriends([...friends, data.friend]);
	};

	const sendRequest = () => {
		SocketState.socket?.emit('friend', {type: 'befriend', target: newFriend, option: ''});
		console.log(friends);
	}

	useEffect(() => {
		if(SocketState.socket) {
			SocketState.socket.on('friend', friendsListener);
		}
		return () => {
			SocketState.socket?.off('friend', friendsListener);
		}
		// eslint-disable-next-line
	}, [friendsListener]);

	return (<div>
	<div>Want some friends?</div>
	<input
		  type="text"
			placeholder="request friend"
		  value={newFriend}
		  onChange={(e) => setNewFriend(e.target.value)}
	  />
	  <button onClick={sendRequest}>Befriend!</button>
	  <div>Your friends are {friends}</div>
  </div>);
	
}