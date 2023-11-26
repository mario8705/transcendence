import React, { useCallback, useState, useRef } from 'react';
import './FriendItem.css';
import MainButton from '../MainButton/MainButton'
import AvatarOthers from '../AvatarOthers/AvatarOthers';

const SENDER = 0;
const RECEIVER = 1;
const FRIENDS = 2;
const BLOCKED = 3;
//0 sender   /1 receiver  /2 accepted /3 blocked

interface Props {
	friendName: string;
	status: number;
	friendId: number;
	onUnblock: () => void;
}

// interface UnblockFriendElem {
// 	status: number,
// 	friend: {
// 		id: number,
// 		pseudo: string,
// 	}
// }

const FriendItem: React.FC<Props> = ({friendName, status, friendId, onUnblock}) => {

	const userId = 48;
	// const friendId = key;
	// const [unblockFriend, setUnblockFriend] = useState< UnblockFriendElem[] | null>(null);
	// const [blockFriend, setBlockFriend] = useState< BlockFriendElem[] | null>(null);
	// const [deletekFriend, setDeleteFriend] = useState< DeleteFriendElem[] | null>(null);
	// const [cancelFriend, setCancelFriend] = useState< CancelUnblockFriendElem[] | null>(null);
	// const [acceptFriend, setAcceptFriend] = useState< AcceptUnblockFriendElem[] | null>(null);
	// const [declineFriend, setDeclineFriend] = useState< DeclineUnblockFriendElem[] | null>(null);

	const handleUnblock = () => {
		fetch(`http://localhost:3000/api/friends/${userId}/unblock/${friendId}`, {
			method: 'POST',
			// headers: {
			//   'Content-Type': 'application/json',
			// },
			// body: JSON.stringify({
			//   userId: /* userId */,
			//   blockedFriendId: /* blockedFriendId */,
			// }),
		})
		.then(response => response.json())
		.then(data => {console.log(data); onUnblock()})
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	// const handleBlock = () => {
	// 	fetch(`http://localhost:3000/api/friends/${userId}/block${key}`, {
	// 		method: 'POST',
	// 	})
	// 	.then(response => response.json())
	// 	.then(data => {
	// 		setBlockFriend(data);
	// 	})
	// 	.catch((error) => {
	// 		console.error('Error:', error);
	// 	});
	// }

	// const handleDelete = () => {
	// 	fetch(`http://localhost:3000/api/friends/${userId}/delete${key}`, {
	// 		method: 'POST',
	// 	})
	// 	.then(response => response.json())
	// 	.then(data => {
	// 		setDeleteFriend(data);
	// 	})
	// 	.catch((error) => {
	// 		console.error('Error:', error);
	// 	});
	// }

	// const handleCancel = () => {
	// 	fetch(`http://localhost:3000/api/friends/${userId}/cancel${key}`, {
	// 		method: 'POST',
	// 	})
	// 	.then(response => response.json())
	// 	.then(data => {
	// 		setCancelFriend(data);
	// 	})
	// 	.catch((error) => {
	// 		console.error('Error:', error);
	// 	});
	// }


	// const handleAccept = () => {
	// 	fetch(`http://localhost:3000/api/friends/${userId}/accept${key}`, {
	// 		method: 'POST',
	// 	})
	// 	.then(response => response.json())
	// 	.then(data => {
	// 		setAcceptFriend(data);
	// 	})
	// 	.catch((error) => {
	// 		console.error('Error:', error);
	// 	});
	// }

	// const handleDecline = () => {
	// 	fetch(`http://localhost:3000/api/friends/${userId}/decline${key}`, {
	// 		method: 'POST',
	// 	})
	// 	.then(response => response.json())
	// 	.then(data => {
	// 		setDeclineFriend(data);
	// 	})
	// 	.catch((error) => {
	// 		console.error('Error:', error);
	// 	});
	// }

    if(status === FRIENDS)
	{
		return (
			<div className="FriendItem-wrapper">
				<div className="box-popup">
					<div className="input-box">
						<AvatarOthers status='Online'/>
						<p>{friendName}</p>
						{/* <MainButton onClick={() => handleClick(PLAY_MODE)}>lol</MainButton> */}
						{/* <MainButton buttonName='Play' mode={PLAY_MODE} onClick={handleClick} />*/}
						<MainButton buttonName='Play' />
						<MainButton buttonName='MSG' />
						<MainButton buttonName='Block' />
					</div>
				</div>
			</div>
		);
	}
	if(status === BLOCKED)
	{
		return (
			<div className="FriendItem-wrapper">
				<div className="box-popup">
					<div className="input-box">
						<AvatarOthers status='Offline'/>
						<p>{friendName}</p>
						<MainButton buttonName='Unblock'onClick={() => handleUnblock()} />
						<MainButton buttonName='Delete' />
					</div>
				</div>
			</div>
		);
	}
	if(status === SENDER)
	{
		return (
			<div className="FriendItem-wrapper">
				<div className="box-popup">
					<div className="input-box">
						<AvatarOthers status='Online'/>
						<p>{friendName}</p>
						<MainButton buttonName='Cancel' />
					</div>
				</div>
			</div>
		);
	}
	if(status === RECEIVER)
	{
		return (
			<div className="FriendItem-wrapper">
				<div className="box-popup">
					<div className="input-box">
						<AvatarOthers status='Online'/>
						<p>{friendName}</p>
						<MainButton buttonName='Accept' />
						<MainButton buttonName='Decline' />
					</div>
				</div>
			</div>
		);
	}
};

export default FriendItem;