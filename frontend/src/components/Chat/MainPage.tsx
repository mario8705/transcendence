
import { useNavigate } from 'react-router-dom';


export const MainPage = () => {

	const navigate = useNavigate();

	const subscribe = () => {
		navigate('/subscribe');
	}

	// const chat = () => {
	// 	navigate('/chat');
	// }

	return (
		<div>
			<h2>Socket IO Information</h2>
			{/* <p>
				Your user ID: <strong>{uid}</strong><br />
				Users online: <strong>{users}</strong><br />
				Socket ID: <strong>{socket?.id}</strong><br />
			</p> */}
			<button onClick={subscribe}>S'inscrire!</button>
		</div>
	)
}

// export {}