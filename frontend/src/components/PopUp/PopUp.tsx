import React, { useEffect, useContext } from "react";
import { AchievementsListContext } from "../../contexts/AchievementsListContext";

import MainButton from "../MainButton/MainButton";

import './PopUp.css';

interface Props {
    userId: number,
    achievementId: number,
	title: string;
    description: string;
    onClose: () => void;
}

const PopUp: React.FC<Props> = ({ userId, infos, onClose }) => {

    return (
        <div className="popup">
            <p style={{marginTop: '40px', }}>{infos.name}</p>
            <p style={{margin: '40px 0', }}>{infos.description}</p>
            <MainButton buttonName="Close" onClick={onClose}/>
        </div>
    );
};

const MemoizedPopUp = React.memo(PopUp);

export default MemoizedPopUp;