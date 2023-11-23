import React, { useCallback, useState, useRef } from 'react';
import './FriendItem.css';
import MainButton from '../MainButton/MainButton'
import AvatarOthers from '../AvatarOthers/AvatarOthers';

// const FRIEND_MODE = 0;
// const PLAY_MODE = 1;
// const MSG_MODE = 2;
// const BLOCK_MODE = 3;

const SENDER = 0;
const RECEIVER = 1;
const FRIEND_MODE = 2;
const BLOCK_MODE = 3;
//0 sender   /1 receiver  /2 accepted /3 blocked

interface Props {
	friendName: string;
	status: number;
}

const FriendItem: React.FC<Props> = ({friendName, status}) => {

	// const [status, setMode] = useState(FRIEND_MODE);

	// const handleClick = useCallback((newMode: number) => {
	// 	setMode(newMode);
	// }, []);



    if(status === FRIEND_MODE)
	{
		return (
			<div className="FriendItem-wrapper">
				<div className="box-popup">
					<div className="input-box">
						<AvatarOthers status='Online'/>
						<p>{friendName}</p>
						{/* <MainButton onClick={() => handleClick(PLAY_MODE)}>lol</MainButton> */}
						{/* <MainButton buttonName='Play' mode={PLAY_MODE} onClick={handleClick} />
						<MainButton buttonName='MSG' mode={MSG_MODE} onClick={handleClick} />
						<MainButton buttonName='Block' mode={BLOCK_MODE} onClick={handleClick} /> */}
						<MainButton buttonName='Play' />
						<MainButton buttonName='MSG' />
						<MainButton buttonName='Block'  />
					</div>
				</div>
			</div>
		);
	}
	if(status === BLOCK_MODE)
	{
		return (
			<div className="FriendItem-wrapper">
				<div className="box-popup">
					<div className="input-box">
						<AvatarOthers status='Offline'/>
						<p>{friendName}</p>
						<MainButton buttonName='Unblock' mode={FRIEND_MODE}  />
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
						{/* <MainButton onClick={() => handleClick(PLAY_MODE)}>lol</MainButton> */}
						{/* <MainButton buttonName='Play' mode={PLAY_MODE} onClick={handleClick} />
						<MainButton buttonName='MSG' mode={MSG_MODE} onClick={handleClick} />
						<MainButton buttonName='Block' mode={BLOCK_MODE} onClick={handleClick} /> */}
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
						{/* <MainButton onClick={() => handleClick(PLAY_MODE)}>lol</MainButton> */}
						{/* <MainButton buttonName='Play' mode={PLAY_MODE} onClick={handleClick} />
						<MainButton buttonName='MSG' mode={MSG_MODE} onClick={handleClick} />
						<MainButton buttonName='Block' mode={BLOCK_MODE} onClick={handleClick} /> */}
						<MainButton buttonName='Accept' />
						<MainButton buttonName='Decline' />
					</div>
				</div>
			</div>
		);
	}
};

export default FriendItem;


// import React, { useCallback, useState, useRef } from 'react';
// import './FriendItem.css';
// import MainButton from '../MainButton/MainButton'
// import AvatarOthers from '../AvatarOthers/AvatarOthers';

// const FRIEND_MODE = 0;
// const PLAY_MODE = 1;
// const MSG_MODE = 2;
// const BLOCK_MODE = 3;

// interface Props {
// 	friendName: string;
// }

// const FriendItem: React.FC<Props> = ({friendName}) => {
// 	const [mode, setMode] = useState(FRIEND_MODE);

// 	const handleClick = useCallback((newMode: number) => {
// 		setMode(newMode);
// 	}, []);


//     if(mode === FRIEND_MODE)
// 	{
// 		return (
// 			<div className="FriendItem-wrapper">
// 				<div className="box-popup">
// 					<div className="input-box">
// 						<AvatarOthers status='Online'/>
// 						<p>{friendName}</p>
// 						<MainButton buttonName='Play' mode={PLAY_MODE} onClick={handleClick} />
// 						<MainButton buttonName='MSG' mode={MSG_MODE} onClick={handleClick} />
// 						<MainButton buttonName='Block' mode={BLOCK_MODE} onClick={handleClick} />
// 					</div>
// 				</div>
// 			</div>
// 		);
// 	}
// 	if(mode === BLOCK_MODE)
// 	{
// 		return (
// 			<div className="FriendItem-wrapper">
// 				<div className="box-popup">
// 					<div className="input-box">
// 						<AvatarOthers status='Offline'/>
// 						<p>{friendName}</p>
// 						<MainButton buttonName='Unblock' mode={FRIEND_MODE} onClick={handleClick} />
// 					</div>
// 				</div>
// 			</div>
// 		);
// 	}
// 	if(mode === PLAY_MODE)
// 	{
// 		return;
// 	}
// 	if(mode === MSG_MODE)
// 	{
// 		return ;
// 	}
// };

// export default FriendItem;