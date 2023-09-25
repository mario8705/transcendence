import React from "react";
import { Avatar, Button } from "@mui/material";
import default_avatar from "../../assets/images/default_avatar.png";
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
                style={{ border: '1px solid green'}}
            />
            <Button 
                color="secondary"
            >
                CHANGE AVATAR
            </Button>
        </div>
    )
}

export default Profile;