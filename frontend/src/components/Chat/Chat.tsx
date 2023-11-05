import React from 'react';
import './Chat.css';
import ChatChannels from './Channels/ChatChannels';
import ChatConv from './ChatConv/ChatConv';

const Chat: React.FC = () => {
	return (
		<div className='chat-wrapper' >
			<ChatChannels />
			<ChatConv/>
		</div>
	)
}

export default Chat;
