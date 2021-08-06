import React from 'react';
import {useAlert} from "../../context/AlertContext";
import './Alert.css'

const Alert = () => {

    const {isVisible, message, hideAlert} = useAlert()

    if (!isVisible) return null

    return (
        <div className="alert" onClick={() => hideAlert()}>
            <div className="alert__text">{message || 'Something went wrong...'}</div>
        </div>
    );
};

export default Alert;
