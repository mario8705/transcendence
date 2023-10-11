import React from 'react';
import './MainButton.css';

interface Props {
    buttonName: string;
}

const MainButton: React.FC<Props> = ({buttonName}) => {
    return (
        <div className=''>
            <button className='mainBtn' >{buttonName}</button>
        </div>
    );
};

export default MainButton;