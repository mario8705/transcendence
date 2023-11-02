import SocketContext from '../../Socket/Context/Context';
import './ChatChannels.css';
import React, { useCallback, useContext, useEffect, useState } from 'react';

const AddChannel: React.FC = () => {
	const [chanName, setChanName] = useState<string>("");
	const [chanPwd, setChanPwd] = useState<string>("");

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const response = await fetch("https://my-backend.com/api/data", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				chanName,
				chanPwd,
			}),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		// DO something if good or not
	};

	return (
		<form className="add-channel" onSubmit={handleSubmit} >
			<input 
				type="text"
				value={chanName}
				onChange={(event) => setChanName(event.target.value)}
				placeholder="name"
			/>
			<input
				type="text" 
				value={chanPwd} 
				onChange={(event) => setChanPwd(event.target.value)}
				placeholder="password" 
			/>
			<button type="submit" >ADD</button>
		</form>
	)
}

interface channelsProp {
	channels: string[];
}

const DisplayChannels: React.FC<channelsProp> = ({ channels }) => {
	let listChannels = channels.map((channel) => 
		<li key={ channel }>
			<button>{ channel }</button>
		</li>
	);

	return (
		<ul className="display-channels" >
			{ listChannels }
		</ul>
	)
}

const ChatChannels: React.FC = () => {
	const [channels, setChannels] = useState<string[] | null>(null);
	const { SocketState } = useContext(SocketContext);

	useEffect(() => {
		fetch('https://my-backend.com/api/channels/my-channel') // UPDATE
			.then((response) => {
				if (!response.ok) {

					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json(); //PROCESS json to get only channel names list
			})
			.then((data) => setChannels(data))
			.catch((error) => {
				console.error('Error:', error);
			});
	}, []);

	useEffect(() => {

		SocketState.socket?.on("updateChannels", updateChannels);

		return () => {
			SocketState.socket?.off("updateChannels", updateChannels)
		};
	}, [SocketState.socket]);


	const updateChannels = useCallback((newChannels: string[]) => {
		setChannels(newChannels);
	}, []);

	return (
		<div className='chat-channels' >
			<h3>Channels</h3>
			{channels && <DisplayChannels channels={channels} />}
			{!channels && <DisplayChannels channels={[]} />}
			<AddChannel />
		</div>
	);
}

export default ChatChannels;
