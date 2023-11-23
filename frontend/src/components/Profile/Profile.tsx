import React from "react";
import { useState, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { AvatarContext } from "../../contexts/AvatarContext";
import { PseudoContext } from "../../contexts/PseudoContext";
import { AchievementsListContext } from "../../contexts/AchievementsListContext";
import { LeaderContext } from "../../contexts/LeaderContext";
import async from 'async';

import Stats from "../Stats/Stats";
import Ladder from "./Ladder/Ladder";
import MatchHistory from "./MatchHistory/MatchHistory";
import Achievements from "./Achievements/Achievements";
import Switch2FA from "./Switch2FA/Switch2FA";
import PopUp from "../PopUp/PopUp";
import PseudoButton from "./PseudoButton/PseudoButton";
import ChangeAvatar from "./ChangeAvatar/ChangeAvatar";

import './Profile.css';

interface Props {
    onRouteChange: (route: string) => void;
}

export interface AvatarContextType {
    avatar: string;
    setAvatar: (avatar: string) => void;
}

export interface PseudoContextType {
    pseudo: string
    setPseudo: (pseudo: string) => void;
}

export interface LeaderContextType {
    smallLeader: boolean
    setSmallLeader: (smallLeader: boolean) => void;
    greatLeader: boolean
    setGreatLeader: (greatLeader: boolean) => void;
}

interface Achievement {
    id: number;
    name: string;
    description: string;
    difficulty: number;
    isHidden: boolean;
    createdAt: Date;
 }
 
 interface UserAchievement {
    userId: number;
    achievement: Achievement;
 }

interface AchievementsListContextType {
    achievementsList: UserAchievement[];
    setAchievementsList: (achievementsList: UserAchievement[]) => void;
}

type GameResult = {
    winner: number
    createdAd: Date
};
   
type Game = {
    gameResult: GameResult;
};

const Profile: React.FC<Props> = () => {
    const [profileInfos, setProfileInfos] = useState(null);
    const [currentPopup, setCurrentPopup] = useState({
        'Newwww Avatar': false,
        'Newwww Pseudo': false,
        '3 total': false,
        '10 total': false,
        '100 total': false,
        'First Game': false,
        'You\'re getting used to Pong': false,
        'You\'re playing a lot': false,
        '3': false,
        '10': false,
        '100': false,
        'Small Leader': false,
        'Great Leader': false,
    });
    const [popupQueue, setPopupQueue] = useState([]);
    const { userId } = useParams();

    const { avatar, setAvatar } = useContext(AvatarContext) as AvatarContextType;
    const { setAchievementsList } = useContext(AchievementsListContext) as AchievementsListContextType;
    const { pseudo, setPseudo } = useContext(PseudoContext) as PseudoContextType;
    const { smallLeader, greatLeader } = useContext(LeaderContext) as LeaderContextType;

    const gamesWonFunc = ( userId: string, games: Game[] ): number => {
        let gamesWon = 0;
        games.map(game => {
            if (game.game.winner == userId) {
                gamesWon++;
            }
        });
        return gamesWon;
    };

    const showPopup = (popup) => {
        setCurrentPopup(prevPopup => ({
            ...prevPopup,
            [popup]: true
        }));
        setPopupQueue(prevQueue => [...prevQueue, popup]);
    }

    const gamesWonInARowFunc = (userId: string, games): number => {
        games.sort((a, b) => new Date(a.game.createdAt).getTime() - new Date(b.game.createdAt).getTime());

        let maxConsecutiveWins = 0;
        let currentConsecutiveWins = 0;

        games.forEach((game) => {
            if (userId == game.game.winner) {
                currentConsecutiveWins++;
                maxConsecutiveWins = Math.max(maxConsecutiveWins, currentConsecutiveWins);
            } else {
                currentConsecutiveWins = 0;
            }
        });

        return maxConsecutiveWins;
    };

    const requestOptionsAchievements = useCallback(({ achievementName, data }) => {
        if (data !== undefined) {
            const requestOptionsGame = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: Number(userId), achievementId: data.achievements[achievementName].id }),
            }
            return requestOptionsGame;
        }
     }, [userId]);
     
     const addAchievement = useCallback(( requestOptions ) => {
        console.log("3", requestOptions);
        return fetch(`http://localhost:3000/api/profile/${userId}/add-achievement-to-user`, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Success:', data);
                return fetch(`http://localhost:3000/api/profile/${userId}/achievements`)
                    .then(response => response.json())
                    .then(data => {
                       setAchievementsList(data);
                    });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
     }, [userId, setAchievementsList]);

     // Only with SQLite ? For Postgresql might need to change concurrency limite or pool size
     const queue = async.queue((task, callback) => {
        addAchievement(task.requestOptions)
         .then(data => {
           callback(null, data);
         })
         .catch(error => {
           callback(error);
         });
       }, 1); // Set concurrency limit to 1
 
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`http://localhost:3000/api/profile/${userId}`);
            const data = await response.json();
            if (data.avatar !== avatar) {
                setAvatar(`http://localhost:3000/static/${data.avatar}`);
            }
            if (data.pseudo !== pseudo) {
                setPseudo(data.pseudo);
            }
            setProfileInfos(prevState => {
                if (JSON.stringify(data) !== JSON.stringify(prevState)) {
                    return data;
                }
                return prevState;
            });

            if (data !== null) {
                const gamesWon = gamesWonFunc(userId, data?.gamesParticipated);
                if (gamesWon >= 3 && data?.achievements["3 total"].users.length === 0) {
                    showPopup('3 total');
                    const requestOptions = requestOptionsAchievements({achievementName: "3 total", data});
                    queue.push({ requestOptions });
                }
                if (gamesWon >= 10 && data?.achievements["10 total"].users.length === 0) {
                    showPopup('10 total');
                    const requestOptions = requestOptionsAchievements({achievementName: "10 total", data});
                    queue.push({ requestOptions });
                }
                if (gamesWon >= 100 && data?.achievements["100 total"].users.length === 0) {
                    showPopup('100 total');
                    const requestOptions = requestOptionsAchievements({achievementName: "100 total", data});
                    queue.push({ requestOptions });
                }

                const gamesWonInARow = gamesWonInARowFunc(userId, data?.gamesParticipated);
                if (gamesWonInARow >= 3 && data?.achievements["3"].users.length === 0) {
                    showPopup("3");
                    const requestOptions = requestOptionsAchievements({achievementName: "3", data});
                    queue.push({ requestOptions });
                }
                if (gamesWonInARow >= 3 && data?.achievements["10"].users.length === 0) {
                    showPopup("10");
                    const requestOptions = requestOptionsAchievements({achievementName: "10", data});
                    queue.push({ requestOptions });
                }
                if (gamesWonInARow >= 3 && data?.achievements["100"].users.length === 0) {
                    showPopup("100");
                    const requestOptions = requestOptionsAchievements({achievementName: "100", data});
                    queue.push({ requestOptions });
                }

                const gameParticipations = data?.gamesParticipated.length;
                if (gameParticipations >= 1 && data?.achievements["First Game"].users.length === 0) {
                    showPopup("First Game");
                    const requestOptions = requestOptionsAchievements({achievementName: "First Game", data});
                    queue.push({ requestOptions });
                }
                if (gameParticipations >= 10 && data?.achievements["You're getting used to Pong"].users.length === 0) {
                    showPopup("You're getting used to Pong");
                    const requestOptions = requestOptionsAchievements({achievementName: "You're getting used to Pong", data});
                    queue.push({ requestOptions });
                }
                if (gameParticipations >= 100 && data?.achievements["You're playing a lot"].users.length === 0) {
                    showPopup("You're playing a lot");
                    const requestOptions = requestOptionsAchievements({achievementName: "You're playing a lot", data});
                    queue.push({ requestOptions });
                }

                if (smallLeader && data?.achievements["Small Leader"].users.length === 0) {
                    showPopup("Small Leader");
                    const requestOptions = requestOptionsAchievements({achievementName: "Small Leader", data});
                    queue.push({ requestOptions });
                }
                if (greatLeader && data?.achievements["Great Leader"].users.length === 0) {
                    showPopup("Great Leader");
                    const requestOptions = requestOptionsAchievements({achievementName: "Great Leader", data});
                    queue.push({ requestOptions });
                }
            }
        };
        fetchData();
    }, [smallLeader, greatLeader]);

    const handleUploadAvatar = (e) => {
        e.preventDefault();

        const file = e.target.files[0];
        console.log(file);
        const formData = new FormData();
        formData.append('file', file);

        const requestOptions = {
            method: 'POST',
            body: formData
        }

        fetch(`http://localhost:3000/api/profile/${userId}/add-avatar`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setAvatar(`http://localhost:3000/static/${data.avatar}`)
                if (!profileInfos?.avatar) {
                    showPopup('Newwww Avatar');
                    const requestOptions2 = requestOptionsAchievements({achievementName: "Newwww Avatar", data});
                    addAchievement(requestOptions2);
                }
            })
    }

    const handleChangePseudo = async (e) => {
        e.preventDefault();

        const pseudo = (e.target.elements as HTMLFormControlsCollection)['outlined-basic'].value;
        const data = { pseudo: pseudo };

        fetch(`http://localhost:3000/api/profile/${userId}/change-pseudo`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            setPseudo(result.pseudo);
            if (profileInfos.achievements["Newwww Pseudo"].users.length === 0) {
                showPopup('Newwww Pseudo');
                const requestOptions = requestOptionsAchievements({achievementName: "Newwww Pseudo", data});
                addAchievement(requestOptions);
            }
            console.log('Success:', result);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    const closePopup = () => {
        setPopupQueue(prevQueue => {
            const firstItem = prevQueue[0];
            setCurrentPopup(prevPopup => ({
                ...prevPopup,
                [firstItem]: false
            }));
            return prevQueue.slice(1)
        });
    };

    return (
        <>
            <div className="overlay" style={{ display: currentPopup['Newwww Avatar'] ? 'block': 'none' }}></div>
            <div className="overlay" style={{ display: currentPopup['Newwww Pseudo'] ? 'block': 'none' }}></div>
            <div className="overlay" style={{ display: currentPopup['3 total'] ? 'block': 'none' }}></div>
            <div className="overlay" style={{ display: currentPopup['10 total'] ? 'block': 'none' }}></div>
            <div className="overlay" style={{ display: currentPopup['100 total'] ? 'block': 'none' }}></div>
            <div className="overlay" style={{ display: currentPopup['First Game'] ? 'block': 'none' }}></div>
            <div className="overlay" style={{ display: currentPopup['You\'re getting used to Pong'] ? 'block': 'none' }}></div>
            <div className="overlay" style={{ display: currentPopup['You\'re playing a lot'] ? 'block': 'none' }}></div>
            <div className="overlay" style={{ display: currentPopup['3'] ? 'block': 'none' }}></div>
            <div className="overlay" style={{ display: currentPopup['10'] ? 'block': 'none' }}></div>
            <div className="overlay" style={{ display: currentPopup['100'] ? 'block': 'none' }}></div>
            <div className="overlay" style={{ display: currentPopup['Small Leader'] ? 'block': 'none' }}></div>
            <div className="overlay" style={{ display: currentPopup['Great Leader'] ? 'block': 'none' }}></div>
            <div className="Profile">
                {popupQueue.length > 0 && <PopUp userId={Number(userId)} infos={profileInfos?.achievements[popupQueue[0]]} onClose={closePopup}/>}
                <ChangeAvatar handleUploadAvatar={handleUploadAvatar} />
                <PseudoButton handleChangePseudo={handleChangePseudo} />
                <Switch2FA />
                <Ladder />
                <Stats />
                <MatchHistory />
                <Achievements />
            </div>
        </>
    )
}

export default Profile;