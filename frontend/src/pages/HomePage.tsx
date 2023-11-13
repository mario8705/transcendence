//import { useAuthContext } from "../contexts/AuthContext";
import MainButton from "../components/MainButton/MainButton";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    //const { user } = useAuthContext();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/play');
    }
    
    return (
        <MainButton buttonName="PLAY" mode={0} onClick={handleClick}/>
    );
};

export default HomePage;
