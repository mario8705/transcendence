import { useContext, useEffect, useState } from "react";
// import { Socket } from "socket.io-client";
import SocketContext from "./contexts/Socket/Context";
import Messages from "./Messages";


function SocketChatComponent() {
	const { SocketState } = useContext(SocketContext);
	const [message, setMessage] = useState('');
	const [userId, setUserId] = useState('');
	const [dest, setDest] = useState('');
	const [from, setFrom] = useState('');
	const [room, setRoom] = useState('');
	const [msgType, setmsgType] = useState('');
	const [messages, setMessages] = useState<string[]>([]);
	const [newFriend, setNewFriend] = useState('');
	const [friends, setFriends] = useState<string[]>([]);
	const [usersConnected, setUsersConnected] = useState<string[]>([]);

	const setName = () => {
		SocketState.uid = userId;
		if (SocketState.socket) {
			SocketState.socket.emit('user', SocketState.uid);
			console.log("socket existe");
		}
		setUserId('');
	}
  
	const sendMessage = () => {
		console.log("sympathique");
		console.log('passe');
		console.log(SocketState.socket);
		SocketState.socket?.emit('message', {type: msgType, to: dest, message: message, options: ''});
		setDest('');
		setMessage('');
	};

	useEffect(() => {
	  if (SocketState.socket) {
		SocketState.socket.on('message', (receivedMessage) => {
		  console.log('Received message:', receivedMessage.message);
		});
		SocketState.socket.on('error', (data: {errmsg: string}) => {
			alert(data.errmsg);
		})
	  }
	  // eslint-disable-next-line
	}, [SocketState.socket]);

	const messageListener = (data : {from: string, to: string, message: string}) => {
			console.log('trop géniale youhou');
			console.log(data.from);
			setFrom(data.from);
			if (data.to !== SocketState.uid)
				console.log("ca s'envoie alors surement à un groupe");
			setMessages([...messages, data.message])
	};

		useEffect(() => {
		if (SocketState.socket)
			SocketState.socket?.on('message', messageListener);
		return () => {
			SocketState.socket?.off('message', messageListener);
		}
		// eslint-disable-next-line
	}, [messageListener])

	const friendsListener = (data : {type: string, from: string, friend: string, status: string}) => {
		console.log('et par ici');
		if (data.type === 'new')
			setFriends([...friends, data.friend]);
	};

	useEffect(() => {
		if(SocketState.socket) {
			SocketState.socket.on('friend', friendsListener);
		}
		return () => {
			SocketState.socket?.off('friend', friendsListener);
		}
		// eslint-disable-next-line
	}, [friendsListener]);

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

	const joinRoom = () => {
		SocketState.socket?.emit('room', {type: 'join', roomname: room, option: {invite: false, key: false, value: ''}});
	}

	const exitRoom = () => {
		SocketState.socket?.emit('room', {type: 'exit', roomname: room, option: {invite: false, key: false, value: ''}});
	}

	const sendRequest = () => {
		SocketState.socket?.emit('friend', {type: 'befriend', target: newFriend, option: ''});
		// SocketState.socket?.on('friend', (data: {type: string, from: string, to: string, status: string}) => {
		// 	if (data.status === 'befriended') {
		// 		setFriends([...friends, newFriend]);
		// 		// friends.push(newFriend);
		// 		setNewFriend('');
		// 	}
		// 	console.log(data.status);
		// })
		console.log(friends);
	}
  
	return (
	  <div>
		<div>
			<input
				type="text"
		  		placeholder="type your name"
				value={userId}
				onChange={(e) => setUserId(e.target.value)}
			/>
			<button onClick={setName}>Submit</button>
		</div>
		<br></br>
		<input type='radio'
			id='priv'
			value={msgType}
			name='messageType'
			onChange={() => setmsgType('priv')}/>
			<label htmlFor="priv">Private Message</label><br></br>
			<input type='radio'
			id='room'
			value={msgType}
			name='messageType'
			onChange={() => setmsgType('room')}/>
			<label htmlFor="room">Room Message</label><br></br>
			<div>{msgType}</div>
		<br></br>
		<br></br>

		<div>
			<input
				type="text"
		  		placeholder="Who to ? "
				value={dest}
				onChange={(e) => setDest(e.target.value)}
			/>
			<div>{dest}</div>
			<br></br>
		</div>
		<div>
		  <input
			type="text"
			placeholder="Type your message"
			value={message}
			onChange={(e) => setMessage(e.target.value)}
		  />
		  <div>{message}</div>
		  <button onClick={sendMessage}>Send</button>
		</div>	  
		<div>
		<Messages messages={messages} from={from}/>		
	  </div>
	  <br></br>
	  <div>
		  <input
			type="room"
			placeholder="join Room"
			value={room}
			onChange={(e) => setRoom(e.target.value)}
		  />
		  <div>{room}</div>
		  <button onClick={joinRoom}>Join</button>
		</div>
		<br></br>
		<div>
		  <input
			type="toexit"
			placeholder="exit Room"
			value={room}
			onChange={(e) => setRoom(e.target.value)}
		  />
		  <div>{room}</div>
		  <button onClick={exitRoom}>Exit</button>
		</div>
		<br></br>
		<div>
		  <div>Want some friends?</div>
		  <input
				type="text"
		  		placeholder="request friend"
				value={newFriend}
				onChange={(e) => setNewFriend(e.target.value)}
			/>
			<button onClick={sendRequest}>Befriend!</button>
			<div>Your friends are {friends}</div>
		</div>
		<br></br>
		<br></br>
		<div>Users Connected : {usersConnected}</div>
	  </div>
	);
  }
  
  export default SocketChatComponent;

  