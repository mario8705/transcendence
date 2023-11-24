import './FriendList.css';
import FriendItem from '../FriendItem/FriendItem';
import { useCallback, useEffect, useState } from 'react';
import MainButton from '../MainButton/MainButton';

const SENDER = 0;
const RECEIVER = 1;
const FRIENDS = 2;
const BLOCKED = 3;

interface FriendElem {
	status: number,
	friend: {
		id: number,
		pseudo: string,
	}
}

const FriendList: React.FC = () => {
	const [friendList, setFriendList] = useState< FriendElem[] | null>(null);
	const userId = 48;
			
		useEffect(() => {
			const fetchData = async () => {
				const response = await fetch(`http://localhost:3000/api/friends/${userId}`);
			const data = await response.json();
			console.log(data);
			setFriendList(data);
		};
		fetchData();
	}, []); 
	
	const friendsWithStatus0 = friendList ? friendList.filter(friend => friend.status === 0) : [];
	const friendsWithStatus1 = friendList ? friendList.filter(friend => friend.status === 1) : [];
	const friendsWithStatus2 = friendList ? friendList.filter(friend => friend.status === 2) : [];
	const friendsWithStatus3 = friendList ? friendList.filter(friend => friend.status === 3) : [];

	const [mode, setMode] = useState(FRIENDS);

	const handleClick = useCallback((newMode: number) => {
		setMode(newMode);
	}, []);

		if (mode == 1)
		{
			return (
			<div className="FriendList-wrapper">
				<div className="box-change">
					<div className='choice-button' onClick={() => handleClick(FRIENDS)}>Friends</div>
					<div className='choice-button' onClick={() => handleClick(SENDER)}>Friendship received</div>
					<div className='choice-button' onClick={() => handleClick(RECEIVER)}>Friendship sent</div>
					<div className='choice-button' onClick={() => handleClick(BLOCKED)}>Blocked friends</div>
				</div>
				<div className="box">
					<h2>Friendship received</h2>
					{
						friendList && Array.prototype.map.call(friendsWithStatus1 || [], ({ status, friend: { id, pseudo } }) => (
							<FriendItem key={id} friendName={pseudo} status={status} />
						))
					}
				</div>
			</div>
			);
		}

		else if (mode == 0)
		{
			return (
				<div className="FriendList-wrapper">
					<div className="box-change">
						<div className='choice-button' onClick={() => handleClick(FRIENDS)}>Friends</div>
						<div className='choice-button' onClick={() => handleClick(SENDER)}>Friendship received</div>
						<div className='choice-button' onClick={() => handleClick(RECEIVER)}>Friendship sent</div>
						<div className='choice-button' onClick={() => handleClick(BLOCKED)}>Blocked friends</div>
					</div>
					<div className="box">
						<h2>Friendship sent</h2>
						{
							friendList && Array.prototype.map.call(friendsWithStatus0 || [], ({ status, friend: { id, pseudo } }) => (
							<FriendItem key={id} friendName={pseudo} status={status} />
							))
						}
					</div>
				</div>
			);
		}

		else if (mode == 3)
		{
			return (
				<div className="FriendList-wrapper">
					<div className="box-change">
						<div className='choice-button' onClick={() => handleClick(FRIENDS)}>Friends</div>
						<div className='choice-button' onClick={() => handleClick(SENDER)}>Friendship received</div>
						<div className='choice-button' onClick={() => handleClick(RECEIVER)}>Friendship sent</div>
						<div className='choice-button' onClick={() => handleClick(BLOCKED)}>Blocked friends</div>
					</div>
					<div className="box">
						<h2>Blocked friends</h2>
						{
							friendList && Array.prototype.map.call(friendsWithStatus3 || [], ({ status, friend: { id, pseudo } }) => (
							<FriendItem key={id} friendName={pseudo} status={status} />
							))
						}
					</div>
				</div>
			);
		}

		else
		{
			return (
				<div className="FriendList-wrapper">
					<div className="box-change">
						<div className='choice-button' onClick={() => handleClick(FRIENDS)}>Friends</div>
						<div className='choice-button' onClick={() => handleClick(SENDER)}>Friendship received</div>
						<div className='choice-button' onClick={() => handleClick(RECEIVER)}>Friendship sent</div>
						<div className='choice-button' onClick={() => handleClick(BLOCKED)}>Blocked friends</div>
					</div>
					<div className="box">
						<h2>Friends</h2>
						{
							friendList && Array.prototype.map.call(friendsWithStatus2 || [], ({ status, friend: { id, pseudo } }) => (
							<FriendItem key={id} friendName={pseudo} status={status} />
							))
						}
					</div>
				</div>
				);
			}
};
export default FriendList;