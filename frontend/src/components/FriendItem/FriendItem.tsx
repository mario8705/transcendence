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
}

const FriendItem: React.FC<Props> = ({friendName, status}) => {

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
						<MainButton buttonName='Unblock' mode={FRIENDS} />
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