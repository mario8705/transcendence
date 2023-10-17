import React from 'react';
import './MainButton.css';

export type MainButtonProps = {
    buttonName: string;
    mode?: number;
    as?: string;
    onClick?: (newMode: number) => void;
    icon?: React.ReactNode;
    [k: string]: any;
}

const MainButton: React.FC<MainButtonProps> = ({buttonName, mode, onClick, icon}) => {
    return (
        <div className=''>
            <button className='mainBtn' onClick={() => onClick && onClick(mode || 0)} > {icon} {buttonName} {icon}</button>
        </div>
    );
};

export default MainButton;