import * as React from "react";
import SocketContext from "../Socket/Context/Context";
import './chat.css';


function GroupChat(props) {

		const room = props.room;
		// const {SocketState} = React.useContext(SocketContext);

		console.log(room);
		// if (room !== '') {
			return (
			<div>
			<h2>{room}</h2>
			<h3>Ca marche</h3>
			<div className='mainspace box-popup' >
				<div>Coucou</div>	

				</div>
				<div className='writingbar'>
					<div>
						Coucou tout le monde
					</div>
			</div>
			</div>
			//TODO: Commencer par faire le caré qui va accuillir toutes les informations.
		)
		// }
	// else {
	// 	return (
	// 		<div>
	// 			<div>Select a conversation</div>
	// 		</div>
	// 	);
	// 	}
		

		

};

export default GroupChat;

