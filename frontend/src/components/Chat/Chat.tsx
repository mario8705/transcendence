import React from 'react';
import './Chat.css';
import ChatChannels from './Channels/ChatChannels';

const Chat: React.FC = () => {
	return (
		<div className='chat-wrapper' >
			<ChatChannels />
		</div>
	)
}

export default Chat;
