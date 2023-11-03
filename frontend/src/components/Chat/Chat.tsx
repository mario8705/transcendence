import React from 'react';
import './Chat.css';
import ChatFriends from './Friends/ChatFriends';

const Chat: React.FC = () => {
	return (
		<div className='chat-wrapper' >
			<ChatFriends/>
		</div>
	)
}

export default Chat;
