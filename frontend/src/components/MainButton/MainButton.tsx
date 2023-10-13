import React from 'react';
import './MainButton.css';

interface Props {
    buttonName: string;
    mode?: number;
    onClick?: (newMode: number) => void;
    icon?: React.ReactNode;
}

const MainButton: React.FC<Props> = ({buttonName, mode, onClick, icon}) => {
    return (
        <div className=''>
            <button className='mainBtn' onClick={() => onClick && onClick(mode || 0)} > {icon} {buttonName} {icon}</button>
        </div>
    );
};

export default MainButton;