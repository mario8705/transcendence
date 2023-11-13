import './FriendList.css';
import FriendItem from '../FriendItem/FriendItem';


const FriendList: React.FC = () => {

	return (
		<div className="FriendList-wrapper">
			<div className="box">
				<h2>Friends</h2>
					<FriendItem friendName='Maximilien'/>
					<FriendItem friendName='Yvan'/>
					<FriendItem friendName='Alexis'/>
					<FriendItem friendName='Heloise'/>
					<FriendItem friendName='Charline'/>
					<FriendItem friendName='Extra'/>
					<FriendItem friendName='Choco'/>
					<FriendItem friendName='Cookies'/>
					<FriendItem friendName='Enormimouuuuuuus'/>
			</div>
		</div>
	);
};

export default FriendList;