import React from 'react';
import './Chat.css';
import MSGS from './msgs/MSGS';

const Chat: React.FC = () => {
	return (
		<div className='chat-wrapper' >
			<MSGS/>
		</div>
	)
}

export default Chat;
