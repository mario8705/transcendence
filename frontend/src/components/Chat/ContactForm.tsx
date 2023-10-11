import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import SocketContext from "../Socket/Context/Context";

export const ContactForm = () => {
	
	const { SocketState, SocketDispatch } = useContext(SocketContext);

	const [value, setValue] = useState("");
	const navigate = useNavigate();

	const saveName = () => {
		SocketDispatch({type: 'update_uid', payload: value});

		if (SocketState.socket)
			SocketState.socket.emit('user', {socket: SocketState.socket, value: value});
		console.log('passe');
		setValue('');
	}

	const chat = () => {
		navigate('/chat');
	}

	const home = () => {
		navigate('/');
	}

	return (
	<div>
		<form>
			<button onClick={home}>Home</button>
			<div>
				<h3>Formulaire</h3>
			</div>
			<div>
				<input
				type='text'
				name='name'
				placeholder="your name"
				value={value}
				onChange={(e)=> setValue(e.target.value)}/>
			</div>
				<div>
					<button onClick={saveName}>Submit Contact</button>
				</div>
				<button onClick={chat}>Chat</button>
			</form>
		</div>
	)
}
