import MainButton from "../components/MainButton/MainButton";
import { useNavigate } from "react-router-dom";

const PlayPage = () => {
    //const { user } = useAuthContext();
    const navigate = useNavigate();

    const handleClick = (whichButton: string) => {
        if (whichButton === "random") {
            navigate('/game');
            return ;
        }
        navigate('/selectfriend');
    }
    
    return (
        <>
            <MainButton buttonName="Friend" mode={0} onClick={() => { handleClick("friend") }}/>
            <MainButton buttonName="Random" mode={0} onClick={() => { handleClick("random") }}/>
        </>
    );
};

export default PlayPage;