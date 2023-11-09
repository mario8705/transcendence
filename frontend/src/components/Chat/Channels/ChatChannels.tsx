import './ChatChannels.css';
import React, { useState } from 'react';

const AddChannel: React.FC = () => {
	const [chanName, setChanName] = useState<string>("");
	const [chanPwd, setChanPwd] = useState<string>("");

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		// Post to join a channel
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
	

	const channels = ["General", "Gaming", "Coding chat lol"]

	// Get list of subsribed channel for the current user

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
