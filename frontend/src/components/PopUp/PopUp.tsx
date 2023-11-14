import React from "react";

import './PopUp.css';

interface Props {
	title: string;
    description: string;
}

const PopUp: React.FC<Props> = ({ title, description, onClose }) => {
    return (
        <div className="popup">
            <p style={{marginTop: '20px', }}>{title}</p>
            <p style={{marginTop: '20px', }}>{description}</p>
            <button onClick={onClose} style={{marginTop: '20px', }}>Close</button>
        </div>
    );
};

export default PopUp;