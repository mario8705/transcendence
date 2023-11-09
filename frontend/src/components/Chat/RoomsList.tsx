import React, { useContext, useEffect, useState } from 'react'
import SocketContext from '../Socket/Context/Context';
import Popup from 'reactjs-popup';
import './chat.css';
import GroupChat from './GroupChat';

export default function RoomsList ({rooms}: {rooms:string[]}) {

	const [selected, setSelected] = useState('');

	return  <div>
			{ rooms.map((room: string, index :number) => (
				<button key={index} onClick={() => {
					setSelected(room);
				}}>{room}</button>
			))}
			{/* <div className='conversations'>
				<div>
					<GroupChat className='groupchat' room={selected}/>	
				</div>
			</div> */}
		</div> 
}