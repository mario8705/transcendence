import React from "react";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Button, TextField } from "@mui/material";
import default_avatar from "../../assets/images/default_avatar.png";
import { AvatarContext } from "../../contexts/AvatarContext";

import Stats from "../Stats/Stats";
import Ladder from "./Ladder/Ladder";
import MatchHistory from "./MatchHistory/MatchHistory";
import Achievements from "./Achievements/Achievements";

import './Profile.css';

interface Props {
    onRouteChange: (route: string) => void;
}

interface AvatarContextType {
    avatar: string;
    setAvatar: (avatar: string) => void;
}

const Profile: React.FC<Props> = ({ onRouteChange }) => {
    const [profileInfos, setProfileInfos] = useState(null);
    //const [avatar, setAvatar] = useState<string | undefined>();
    const { userId } = useParams();

    const { avatar, setAvatar } = useContext(AvatarContext) as AvatarContextType;

    useEffect(() => {
        fetch(`http://localhost:3000/api/profile/${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data.avatar) {
                    setAvatar(`http://localhost:3000/static/${data.avatar}`);
                }
                setProfileInfos(data);
            })
    }, [userId]);

    const handleUploadAvatar = (e) => {
        e.preventDefault();

        const file = e.target.files[0]
        const formData = new FormData();
        formData.append('file', file);

        const requestOptions = {
            method: 'POST',
            body: formData
        }

        fetch(`http://localhost:3000/api/profile/${userId}`, requestOptions)
            .then(response => response.json())
            .then(data => setAvatar(`http://localhost:3000/static/${data.avatar}`))
    }

    return (
        <div className="Profile">
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
            <Ladder profileInfos={profileInfos} />
            <Stats />
            <MatchHistory />
            <Achievements />
        </div>
    )
}

export default Profile;