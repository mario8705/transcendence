import React from 'react';
import './MainButton.css';

const MainButton = ({buttonName}) => {
    return (
        <div className=''>
            <button className='login'>{buttonName}</button>
        </div>
    );
};

export default MainButton;