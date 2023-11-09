import React from 'react';
import './Chat.css';
import ChatFriends from './Friends/ChatFriends';
import ChatChannels from './Channels/ChatChannels';
import ChatConv from './ChatConv/ChatConv';

const Chat: React.FC = () => {
	return (
		<div className='chat-wrapper' >
			<ChatChannels />
			<ChatConv/>
            <ChatFriends />
		</div>
	)
}

export default Chat;
