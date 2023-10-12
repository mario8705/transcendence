import React from 'react';
import './MainButton.css';

export type MainButtonProps = {
    buttonName: string;
    as?: string;
    [k: string]: any;
};

const MainButton: React.FC<MainButtonProps> = ({ buttonName, as = "button", ...props }) => {
    return (
        <div>
            {
                React.createElement(as, {
                    ...props,
                    className: 'mainBtn',
                }, buttonName)
            }
        </div>
    );
};

export default MainButton;