import React, { useCallback, useState, useRef } from 'react';
import './FriendItem.css';
import MainButton from '../MainButton/MainButton'
import AvatarOthers from '../AvatarOthers/AvatarOthers';

const FRIEND_MODE = 0;
const PLAY_MODE = 1;
const MSG_MODE = 2;
const BLOCK_MODE = 3;

interface Props {
	friendName: string;
}

const FriendItem: React.FC<Props> = ({friendName}) => {
	const [mode, setMode] = useState(FRIEND_MODE);

	const handleClick = useCallback((newMode: number) => {
		setMode(newMode);
	}, []);


    if(mode === FRIEND_MODE)
	{
		return (
			<div className="box-parent">
				<div className="box-popup">
					<div className="input-box">
						<AvatarOthers status='Online'/>
						<p>{friendName}</p>
						<MainButton buttonName='Play' mode={PLAY_MODE} onClick={handleClick} />
						<MainButton buttonName='MSG' mode={MSG_MODE} onClick={handleClick} />
						<MainButton buttonName='Block' mode={BLOCK_MODE} onClick={handleClick} />
					</div>
				</div>
			</div>
		);
	}
	if(mode === BLOCK_MODE)
	{
		return (
			<div className="box-parent">
				<div className="box-popup">
					<div className="input-box">
						<AvatarOthers status='Offline'/>
						<p>{friendName}</p>
						<MainButton buttonName='Unblock' mode={FRIEND_MODE} onClick={handleClick} />
					</div>
				</div>
			</div>
		);
	}
	if(mode === PLAY_MODE)
	{
		return;
	}
	if(mode === MSG_MODE)
	{
		return ;
	}
};

export default FriendItem;