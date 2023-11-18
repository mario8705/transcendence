import React from "react";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Button, TextField } from "@mui/material";
import default_avatar from "../../assets/images/default_avatar.png";
import { AvatarContext } from "../../contexts/AvatarContext";
import { AchievementsListContext } from "../../contexts/AchievementsListContext";

import Stats from "../Stats/Stats";
import Ladder from "./Ladder/Ladder";
import MatchHistory from "./MatchHistory/MatchHistory";
import Achievements from "./Achievements/Achievements";
import Switch2FA from "./Switch2FA/Switch2FA";
import PopUp from "../PopUp/PopUp";

import './Profile.css';

interface Props {
    onRouteChange: (route: string) => void;
}

interface AvatarContextType {
    avatar: string;
    setAvatar: (avatar: string) => void;
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

const Profile: React.FC<Props> = () => {
    const [profileInfos, setProfileInfos] = useState(null);
    const [isPopupVisible, setPopupVisible] = useState(false);
    //const [avatar, setAvatar] = useState<string | undefined>();
    const { userId } = useParams();

    const { avatar, setAvatar } = useContext(AvatarContext) as AvatarContextType;
    const { achievementsList, setAchievementsList } = useContext(AchievementsListContext) as AchievementsListContextType;

    useEffect(() => {
        fetch(`http://localhost:3000/api/profile/${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data.avatar) {
                    setAvatar(`http://localhost:3000/static/${data.avatar}`);
                }
                setProfileInfos(data);
            })
    }, [userId, setAvatar]);

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

        const requestOptions2 = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: Number(userId), achievementId: profileInfos?.achievement[0].id }),
        }

        fetch(`http://localhost:3000/api/profile/${userId}/add-avatar`, requestOptions)
            .then(response => response.json())
            .then(data => {
                setAvatar(`http://localhost:3000/static/${data.avatar}`)
                if (!profileInfos?.avatar) {
                    setPopupVisible(true); // TODO: Only the first time.
                    console.log("HHHHHHHHHHHHHHHH");
                    fetch(`http://localhost:3000/api/profile/${userId}/add-achievement-to-user`, requestOptions2)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Error');
                            }
                            return response.json();
                        })
                        .then((data) => {
                            console.log('Success:', data);
                            fetch(`http://localhost:3000/api/profile/${userId}/achievements`)
                                .then(response => response.json())
                                .then(data => {
                                    setAchievementsList(data);
                                });
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });
                }
            })
    }

    const closePopup = () => {
        setPopupVisible(false);
    };

    return (
        <>
            <div className="overlay" style={{ display: isPopupVisible ? 'block': 'none' }}></div>
            <div className="Profile">
                {isPopupVisible && <PopUp userId={Number(userId)} achievementId={profileInfos?.achievement[0].id} title={profileInfos?.achievement[0].name} description={profileInfos?.achievement[0].description} onClose={closePopup}/>}
                <Avatar
                    alt="Avatar"
                    src={avatar || default_avatar}
                    sx={{
                        width: '6vh',
                        height: '6vh'
                    }}
                />
                <Button
                    variant="text"
                    sx={{ 
                        fontSize: '1em', 
                        marginTop: '1.5vh',
                        fontWeight: '900',
                        color: "#F8A38B",
                    }}
                    onClick={() => (document.getElementById('fileInput') as HTMLElement).click()}
                >
                    CHANGE AVATAR 
                </Button>
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    onChange={handleUploadAvatar}
                />
                <TextField 
                    id="outlined-basic" 
                    label="Change pseudo"
                    InputLabelProps={{
                        style: { 
                            color: '#7638C7', 
                            fontSize: '1em', 
                        }
                    }}
                    variant="outlined"
                    placeholder={`${profileInfos?.pseudo ?? ''}`}
                    sx={{
                        color: '#9747FF',
                        marginTop: '3vh',
                        width: '35vw',
                        minWidth: '200px',
                        maxWidth: '300px',
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                            borderRadius: '20px',
                            border: '3px solid #9747FF',
                            //   backgroundColor: "#F8A38B",
                            },
                            '&:hover fieldset': {
                                border: '4px solid #7638C7'
                            },
                            '&.Mui-focused fieldset': {
                                border: '4px solid #7638C7'
                            },
                        },
                    }}
                />
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