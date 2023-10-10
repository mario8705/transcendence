import React from "react";
import { Avatar, Button, TextField } from "@mui/material";
import default_avatar from "../../assets/images/default_avatar.png";

import Ladder from "./Ladder/Ladder";
import MatchHistory from "./MatchHistory/MatchHistory";
import Achievements from "./Achievements/Achievements";

import './Profile.css';

interface Props {
    onRouteChange: (route: string) => void;
}

const Profile: React.FC<Props> = ({ onRouteChange }) => {
    return (
        <div className="Profile">
            <Avatar
                alt="Avatar" 
                src={default_avatar}
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
            >
                CHANGE AVATAR
            </Button>
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
                placeholder="TODO: get current pseudo"
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
            <Ladder />
            <MatchHistory />
            <Achievements />
        </div>
    )
}

export default Profile;