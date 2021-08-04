import React from 'react';
import './Choice.css'

const choicesMappings = {
    1: '✊',
    2: '✋',
    3: '✌'
}

const Choice = ({color, choice, nickname}) => {
    return (
        <div className="choice">
            <div className="choice__item circle" style={{backgroundColor: color}}>
                {choicesMappings[choice]}
            </div>
            {nickname &&
            <p className="choice__nickname">{nickname.length < 15 ? nickname : `${nickname.substring(0, 15)}...`}</p>}
        </div>
    );
};

export default Choice;
