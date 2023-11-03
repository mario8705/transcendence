import "./ChatFriends.css";
import { useCallback, useContext, useEffect, useState } from "react";
import SocketContext from "../../Socket/Context/Context";

const AddFriend: React.FC = () => {
	const [friendName, setFriendName] = useState<string>("");

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const response = await fetch("https://my-backend.com/api/data", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				friendName,
			}),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
		// DO something if good or not
	};

	return (
		<form className="add-friend" onSubmit={handleSubmit} >
			<input
				type="text"
				value={friendName}
				onChange={(event) => setFriendName(event.target.value)}
				placeholder="name"
			/>
			<button type="submit" >ADD</button>
		</form>
	)
}

interface friendsProp {
	friends: string[];
}

const DisplayFriends: React.FC<friendsProp> = ({ friends }) => {
	let listFriends = friends.map((friend) =>
		<li key={ friend }>
			<button>{ friend }</button>
		</li>
	);

	return (
		<ul className="display-friends" >
			{ listFriends }
		</ul>
	);
}

const ChatFriends: React.FC = () => {
	const [friends, setFriends] = useState<string[] | null>(null);
	const { SocketState } = useContext(SocketContext);

	useEffect(() => {
		fetch('https://my-backend.com/api/channels/my-channel') // UPDATE
			.then((response) => {
				if (!response.ok) {

					throw new Error(`HTTP error! status: ${response.status}`);
				}
				return response.json(); //PROCESS json to get only channel names list
			})
			.then((data) => setFriends(data))
			.catch((error) => {
				console.error('Error:', error);
			});
	}, []);

	useEffect(() => {
		SocketState.socket?.on("updateFriends", updateFriends);

		return () => {
			SocketState.socket?.off("updateFriends", updateFriends);
		};
	}, [SocketState.socket]);

	const updateFriends = useCallback((newFriends: string[]) => {
		setFriends(newFriends);
	}, []);

	return (
		<div className="chat-friends">
			<h3>Friends</h3>
			{friends && <DisplayFriends friends={friends} />}
			{!friends && <DisplayFriends friends={[]} />}
			<AddFriend />
		</div>
	);
}

export default ChatFriends;
