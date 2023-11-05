import React from 'react';
import './Chat.css';
import ChatConv from './ChatConv/ChatConv';

const Chat: React.FC = () => {
	return (
		<div className='chat-wrapper' >
			<ChatConv/>
		</div>
	)
}

export default Chat;
