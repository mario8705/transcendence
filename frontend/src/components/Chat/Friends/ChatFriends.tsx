import "./ChatFriends.css";
import { useEffect, useState } from "react";

const AddFriend: React.FC = () => {
	const [friendName, setFriendName] = useState<string>("");

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		// POST REQUEST to join channel
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

	const friends = ["friendA", "Cha", "Yvanx"];

	useEffect(() => {
		// GET request for channels of the user
	}, []);

	return (
		<div className="chat-friends">
			<h3>Friends</h3>
			<DisplayFriends friends={friends} />
			<AddFriend />
		</div>
	);
}

export default ChatFriends;
