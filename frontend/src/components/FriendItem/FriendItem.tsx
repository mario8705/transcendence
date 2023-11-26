import React, { useCallback, useState, useRef } from 'react';
import './FriendItem.css';
import MainButton from '../MainButton/MainButton'
import AvatarOthers from '../AvatarOthers/AvatarOthers';

const SENDER = 0;
const RECEIVER = 1;
const FRIENDS = 2;
const BLOCKED = 3;
//0 sender   /1 receiver  /2 accepted /3 blocked

interface FriendElem {
	status: number,
	friend: {
		id: number,
		pseudo: string,
	}
}

interface Props {
	userId: number;
	friendName: string;
	status: number;
	friendId: number;
	// onUnblock: () => void;
	// onBlock: () => void;
	// onDelete: () => void;
	// onCancel: () => void;
	// onAccept: () => void;
	// onDecline: () => void;
	parentRerender: (data: FriendElem[] | null) => void;
}

// const FriendItem: React.FC<Props> = ({userId, friendName, status, friendId, onUnblock, onBlock, onDelete, onCancel, onAccept, onDecline}) => {
	const FriendItem: React.FC<Props> = ({userId, friendName, status, friendId, parentRerender}) => {
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
		.then(data => parentRerender(data))
		// .then(data => onUnblock())
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	const handleBlock = () => {
		fetch(`http://localhost:3000/api/friends/${userId}/block/${friendId}`, {
			method: 'POST',
		})
		.then(response => response.json())
		.then(data => parentRerender(data))
		// .then(data => onBlock())
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	const handleDelete = () => {
		fetch(`http://localhost:3000/api/friends/${userId}/delete/${friendId}`, {
			method: 'POST',
		})
		.then(response => response.json())
		.then(data => parentRerender(data))
		// .then(data => onDelete())
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	const handleCancel = () => {
		fetch(`http://localhost:3000/api/friends/${userId}/cancel/${friendId}`, {
			method: 'POST',
		})
		.then(response => response.json())
		.then(data => parentRerender(data))
		// .then(data => onCancel())
		.catch((error) => {
			console.error('Error:', error);
		});
	}


	const handleAccept = () => {
		fetch(`http://localhost:3000/api/friends/${userId}/accept/${friendId}`, {
			method: 'POST',
		})
		.then(response => response.json())
		.then(data => parentRerender(data))
		// .then(data => onAccept())
		.catch((error) => {
			console.error('Error:', error);
		});
	}

	const handleDecline = () => {
		fetch(`http://localhost:3000/api/friends/${userId}/decline/${friendId}`, {
			method: 'POST',
		})
		.then(response => response.json())
		.then(data => parentRerender(data))
		// .then(data => onDecline())
		.catch((error) => {
			console.error('Error:', error);
		});
	}

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
						<MainButton buttonName='Block' onClick={() => handleBlock()} />
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
						<MainButton buttonName='Unblock' onClick={() => handleUnblock()} />
						<MainButton buttonName='Delete' onClick={() => handleDelete()} />
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
						<MainButton buttonName='Cancel' onClick={() => handleCancel()} />
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
						<MainButton buttonName='Accept' onClick={() => handleAccept()} />
						<MainButton buttonName='Decline'onClick={() => handleDecline()}  />
					</div>
				</div>
			</div>
		);
	}
};

export default FriendItem;