import React from 'react';
import './MainButton.css';
import { styled } from '@mui/material';
import cx from 'classnames';

export type MainButtonProps = {
    buttonName: string;
    as?: string;
    className?: string;
    icon?: React.ReactNode;
    [k: string]: any;
}

const MainButton = styled((({ buttonName, as = 'button', className, icon, ...props }) => {
    return (
        React.createElement(as, {
            ...props,
            className: cx('mainBtn', className),
        }, ...(icon ? [ icon, buttonName, icon ] : [ buttonName ]))
    );
}) as React.FC<MainButtonProps>)({
    '& .icon': {
        fontSize: '1em',
        color: 'white',
    },
    '& .icon:first-of-type': {
        marginRight: '15px',
    },
    '& .icon:last-of-type': {
        marginLeft: '15px',
    },
});

export default MainButton;