import React from 'react';
import cx from 'classnames';
import './MainButton.css';

export type MainButtonProps = {
    buttonName: string;
    as?: string;
    className?: string;
    loading?: boolean;
    icon?: React.ReactNode;
    [k: string]: any;
}

const MainButton: React.FC<MainButtonProps> = ({ buttonName, as = 'button', loading = false, className, icon, ...props }) => (
    React.createElement(as, {
        ...props,
        className: cx('mainBtn', { 'is-loading': loading }, className),
    }, ...(loading ? [ <span className="loader" /> ] : (icon ? [ icon, buttonName, icon ] : [ buttonName ])))
);

export default MainButton;