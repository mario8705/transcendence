import "./PlayPage.css";
import MainButton from "../components/MainButton/MainButton";
import { useNavigate } from "react-router-dom";
import { useCallback, useContext, useEffect, useState } from "react";
import SocketContext from "../components/Socket/Context/Context";

const PlayPage = () => {
    //const { user } = useAuthContext();
    const { SocketState } = useContext(SocketContext);
    const [waiting, setWaiting] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleClick = (whichButton: string) => {
        if (whichButton === "random-normal") {
            SocketState.socket?.emit("joinRandomNormal");
console.log("TRY NORMAL RANDOM", SocketState);
            setWaiting(true);
            return ;
        }
        else if (whichButton === "friend-normal")
        {
            // navigate('/selectfriend');
                return ;
        }
        else if (whichButton === "random-special") {
            SocketState.socket?.emit("joinRandomSpecial");
console.log("TRY SPECIAL RANDOM");
            setWaiting(true);
            return ;
        }
        else if (whichButton === "friend-special")
        {
            // navigate('/selectfriend');
            return ;
        }
        }

    const handleCancel = () => {
        SocketState.socket?.emit("cancelGameSearch");
console.log("cancel search");
        setWaiting(false);
    };

    const launchRandomNormal = useCallback(() => {
console.log("laucnh NORMAL game");
        navigate('/game-normal');
    }, []);

    const launchRandomSpecial = useCallback(() => {
console.log("launch SPECIAL game");
        navigate('/game-special');
    }, []);

    useEffect(() => {
        SocketState.socket?.on("launchRandomNormal", launchRandomNormal);
        SocketState.socket?.on("launchRandomSpecial", launchRandomSpecial);
        // SocketState.socket?.on("joinFriendMatch", joinFriendMatch)

        return () => {
            SocketState.socket?.off("launchRandomNormal", launchRandomNormal);
            SocketState.socket?.off("launchRandomSpecial", launchRandomSpecial);
            // SocketState.socket?.off("joinFriendMatch", joinFriendMatch)
        };
    }, [SocketState.socket]);

    // GET USERS FRIENDS LIST (online or not ?, in game or not ?)
    // const { data, isError, isLoading, isSuccess } = useQuery('friendList', ....);
    // const data = ["Charline", "Yvan", "Alexis", "Heloise"];


    return (
        <div className="game-modes">
            <div className="normal-mode">
                <h3>Normal</h3>
                { !waiting && <MainButton buttonName="Random" mode={0} onClick={() => { handleClick("random-normal") }}/> }
                { !waiting && <MainButton buttonName="Friend" mode={0} onClick={() => { handleClick("friend-normal") }}/> }
                { waiting && <MainButton buttonName="X" mode={0} onClick={() => { handleCancel() }} />}
                {/* { isSuccess && <MainButton buttonName="Friend" mode={0} onClick={() => { handleClick("friend-normal") }}/> } */}
            </div>
            <div className="special-mode">
                <h3>Special</h3>
                { !waiting && <MainButton buttonName="Random" mode={0} onClick={() => { handleClick("random-special") }}/> }
                { !waiting && <MainButton buttonName="Friend" mode={0} onClick={() => { handleClick("friend-special") }}/> }
                { waiting && <MainButton buttonName="X" mode={0} onClick={() => { handleCancel() }} />}
                {/* { isSuccess && <MainButton buttonName="Friend" mode={0} onClick={() => { handleClick("friend-special") }}/> } */}
            </div>
        </div>
    );
};

export default PlayPage;
